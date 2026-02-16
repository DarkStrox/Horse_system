using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Text.Json;
using ArabianHorseSystem.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using System.Threading.Tasks;

namespace ArabianHorseSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly ILogger<AIController> _logger;
        private readonly IWebHostEnvironment _env;

        public AIController(ILogger<AIController> logger, IWebHostEnvironment env)
        {
            _logger = logger;
            _env = env;
        }

        [HttpPost("predict-breed")]
        public async Task<IActionResult> PredictBreed([FromBody] BreedPredictionRequest request)
        {
            try
            {
                // 1. Run the base ML model prediction first
                string mlScriptPath = Path.Combine(_env.ContentRootPath, "..", "predict_breed.py");
                string mlInputJson = JsonSerializer.Serialize(request);
                
                string mlOutput = await RunPythonScriptAsync(mlScriptPath, mlInputJson);
                var mlResponse = SafeDeserialize<BreedPredictionResponse>(mlOutput);

                if (mlResponse == null || mlResponse.Status == "error")
                {
                    return BadRequest(new { error = mlResponse?.Error ?? "Base prediction failed.", raw = mlOutput });
                }

                // 2. If advanced mode is ON, run Grok for validation and feedback
                _logger.LogInformation("PredictBreed: IsAdvanced={IsAdvanced}, ImageDataLength={ImageLen}", request.IsAdvanced, request.ImageData?.Length ?? 0);
                if (request.IsAdvanced && !string.IsNullOrEmpty(request.ImageData))
                {
                    try 
                    {
                        string grokScriptPath = Path.Combine(_env.ContentRootPath, "..", "grok_predict.py");
                        var grokInput = new
                        {
                            traits = new {
                                request.Height_cm,
                                request.Weight_kg,
                                request.Head_Profile,
                                request.Tail_Carriage,
                                request.Neck_Arch,
                                request.Rib_Count,
                                request.Back_Length
                            },
                            image_data = request.ImageData,
                            ml_prediction = mlResponse.Breed
                        };

                        string grokInputJson = JsonSerializer.Serialize(grokInput);
                        var grokOutput = await RunPythonScriptAsync(grokScriptPath, grokInputJson);
                        _logger.LogInformation("Grok Output: {GrokOutput}", grokOutput);
                        
                        using (var grokDoc = JsonDocument.Parse(ExtractJson(grokOutput)))
                        {
                            var root = grokDoc.RootElement;
                            if (root.TryGetProperty("feedback", out var feedback))
                            {
                                mlResponse.AdvancedFeedback = feedback.GetString();
                            }
                            
                            if (root.TryGetProperty("matches", out var matches))
                            {
                                mlResponse.Matches = matches.GetBoolean();
                            }
                            else if (root.TryGetProperty("error", out var err))
                            {
                                mlResponse.AdvancedFeedback = $"Advanced mode error: {err.GetString()}";
                            }
                        }
                    }
                    catch (Exception grokEx)
                    {
                        _logger.LogError(grokEx, "Grok prediction failed");
                        mlResponse.AdvancedFeedback = $"Advanced mode failed: {grokEx.Message}";
                    }
                }

                _logger.LogInformation("Final Response: Breed={Breed}, Feedback={Feedback}", mlResponse.Breed, mlResponse.AdvancedFeedback);
                return Ok(mlResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in PredictBreed");
                try {
                    string logPath = Path.Combine(_env.ContentRootPath, "api_error_log.txt");
                    System.IO.File.AppendAllText(logPath, $"{DateTime.Now}: {ex.Message}\n{ex.StackTrace}\n");
                } catch {}
                return StatusCode(500, new { error = "Internal server error.", details = ex.Message });
            }
        }

        private async Task<string> RunPythonScriptAsync(string scriptPath, string inputJson)
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"\"{scriptPath}\"",
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            startInfo.EnvironmentVariables.Add("PYTHONIOENCODING", "utf-8");

            using (var process = new Process { StartInfo = startInfo })
            {
                process.Start();
                await process.StandardInput.WriteLineAsync(inputJson);
                process.StandardInput.Close();

                string output = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                if (process.ExitCode != 0 && string.IsNullOrEmpty(output))
                {
                    throw new Exception($"Python failed (Code {process.ExitCode}): {error}");
                }

                return output;
            }
        }

        private T? SafeDeserialize<T>(string input) where T : class
        {
            try {
                string json = ExtractJson(input);
                return JsonSerializer.Deserialize<T>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            } catch {
                return null;
            }
        }

        private string ExtractJson(string input)
        {
            int start = input.IndexOf('{');
            int end = input.LastIndexOf('}');
            if (start >= 0 && end > start) {
                return input.Substring(start, end - start + 1);
            }
            return input;
        }
    }
}

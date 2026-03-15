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
                if (string.IsNullOrEmpty(request.ImageData))
                {
                    return BadRequest(new { error = "Image Data is required.", status = "error" });
                }

                _logger.LogInformation("PredictBreed: Triggered with new image approach. Image Length={ImageLen}", request.ImageData.Length);

                // Setup the payload to match what python script expects
                var pyInput = new
                {
                    ImageData = request.ImageData
                };

                string scriptPath = Path.Combine(_env.ContentRootPath, "..", "predict_image.py");
                string inputJson = JsonSerializer.Serialize(pyInput);
                
                string pyOutput = await RunPythonScriptAsync(scriptPath, inputJson);
                var pyResponse = SafeDeserialize<BreedPredictionResponse>(pyOutput);

                if (pyResponse == null || pyResponse.Status == "error")
                {
                    _logger.LogError("Prediction script error response. Raw output: {Raw}", pyOutput);
                    return BadRequest(new { 
                        error = pyResponse?.Error ?? "Python prediction failed.", 
                        status = "error"
                    });
                }

                return Ok(pyResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in PredictBreed");
                return StatusCode(500, new { error = "Internal server error.", details = ex.Message });
            }
        }

        [HttpPost("predict-strain")]
        public async Task<IActionResult> PredictStrain([FromBody] StrainPredictionRequest request)
        {
            try
            {
                _logger.LogInformation("PredictStrain: Triggered for horse strain data prediction.");

                string scriptPath = Path.Combine(_env.ContentRootPath, "..", "predict_strain.py");
                string inputJson = JsonSerializer.Serialize(request);
                
                string pyOutput = await RunPythonScriptAsync(scriptPath, inputJson);
                var pyResponse = SafeDeserialize<StrainPredictionResponse>(pyOutput);

                if (pyResponse == null || pyResponse.Status == "error")
                {
                    _logger.LogError("Strain prediction script error response. Raw output: {Raw}", pyOutput);
                    return BadRequest(new { 
                        error = pyResponse?.Error ?? "Python prediction failed.", 
                        status = "error"
                    });
                }

                return Ok(pyResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in PredictStrain");
                return StatusCode(500, new { error = "Internal server error.", details = ex.Message });
            }
        }

        private async Task<string> RunPythonScriptAsync(string scriptPath, string inputJson)
        {
            string tempInputFile = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.json");
            await System.IO.File.WriteAllTextAsync(tempInputFile, inputJson);

            var startInfo = new ProcessStartInfo
            {
                FileName = "python",
                Arguments = $"\"{scriptPath}\" \"{tempInputFile}\"",
                RedirectStandardInput = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };
            startInfo.EnvironmentVariables.Add("PYTHONIOENCODING", "utf-8");

            try
            {
                using (var process = new Process { StartInfo = startInfo })
                {
                    process.Start();

                    string output = await process.StandardOutput.ReadToEndAsync();
                    string error = await process.StandardError.ReadToEndAsync();
                    await process.WaitForExitAsync();

                    if (!string.IsNullOrEmpty(error))
                    {
                        _logger.LogError("Python Error Stream: {Error}", error);
                    }

                    if (string.IsNullOrWhiteSpace(output) && !string.IsNullOrWhiteSpace(error))
                    {
                        return $"{{\"status\": \"error\", \"error\": \"{error.Replace("\"", "\\\"").Replace("\n", " ").Replace("\r", "")}\"}}";
                    }

                    return output;
                }
            }
            finally
            {
                if (System.IO.File.Exists(tempInputFile))
                {
                    try { System.IO.File.Delete(tempInputFile); } catch { }
                }
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

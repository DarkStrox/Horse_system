using ArabianHorseSystem.Data;
using ArabianHorseSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ArabianHorseSystem.Services;
using System.Net.Http;
using System.Net.Http.Json;

using Microsoft.AspNetCore.Authorization;

namespace ArabianHorseSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly NewsService _newsService;
        private readonly HttpClient _httpClient;
        private readonly ILogger<NewsController> _logger;
        private const string NewsApiKey = "17d1482fe9844123ac9e27eef48baf6c"; 

        [HttpGet("cleanup-tests")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CleanupTests()
        {
            var testNews = await _context.NewsPosts
                .Where(n => n.Url.Contains("example.com") || n.Url.Contains("internal-") || n.Title.Contains("Quantum"))
                .ToListAsync();
            _context.NewsPosts.RemoveRange(testNews);
            int count = await _context.SaveChangesAsync();
            return Ok(new { message = $"Deleted {count} test articles." });
        }

        public NewsController(ApplicationDbContext context, NewsService newsService, HttpClient httpClient, ILogger<NewsController> logger)
        {
            _context = context;
            _newsService = newsService;
            _httpClient = httpClient;
            _logger = logger;
        }

        // GET: api/News
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsPost>>> GetNews()
        {
            return await _context.NewsPosts
                .OrderByDescending(n => n.PublishedAt)
                .Take(12) // Limit to latest 12 as requested
                .ToListAsync();
        }

        // GET: api/News/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NewsPost>> GetNewsPost(int id)
        {
            var newsPost = await _context.NewsPosts.FindAsync(id);

            if (newsPost == null)
            {
                return NotFound();
            }

            return newsPost;
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNewsPost(int id)
        {
            var newsPost = await _context.NewsPosts.FindAsync(id);
            if (newsPost == null)
            {
                return NotFound();
            }

            _context.NewsPosts.Remove(newsPost);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("search")]
        public async Task<ActionResult<object>> SearchNews([FromBody] SearchDto search)
        {
            try
            {
                if (search == null || string.IsNullOrWhiteSpace(search.Query))
                {
                    return BadRequest("Search query is required.");
                }
                string url = $"https://newsapi.org/v2/everything?q={Uri.EscapeDataString(search.Query)}&sortBy=relevancy&language=en&apiKey={NewsApiKey}";
                
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Add("User-Agent", "ArabianHorseSystem/1.0");
                request.Headers.Add("Accept", "application/json");
                
                var apiResponse = await _httpClient.SendAsync(request);
                if (!apiResponse.IsSuccessStatusCode)
                {
                    var errorContent = await apiResponse.Content.ReadAsStringAsync();
                    _logger.LogError("Search NewsAPI Error - Status: {Status}, Body: {Body}", apiResponse.StatusCode, errorContent);
                    return StatusCode((int)apiResponse.StatusCode, new { error = "NewsAPI Error", details = errorContent });
                }
                var content = await apiResponse.Content.ReadFromJsonAsync<object>();
                return content;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }

        [HttpPost("scrape")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ScrapeNews()
        {
            try
            {
                _logger.LogInformation("Manual news scrape triggered by {User}", User.Identity?.Name);
                
                string today = DateTime.Now.ToString("yyyy-MM-dd");
                string fromDate = DateTime.Now.AddDays(-27).ToString("yyyy-MM-dd");
                string query = Uri.EscapeDataString("\"Arabian horse\" OR \"Purebred Arabian\"");
                string url = $"https://newsapi.org/v2/everything?q={query}&from={fromDate}&to={today}&sortBy=publishedAt&language=en&apiKey={NewsApiKey}";

                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Add("User-Agent", "ArabianHorseSystem/1.0");
                request.Headers.Add("Accept", "application/json");

                _logger.LogInformation("Sending request to NewsAPI: {Url}", url);
                var response = await _httpClient.SendAsync(request);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    _logger.LogError("NewsAPI Error - Status: {Status}, Body: {Body}", response.StatusCode, errorBody);
                    return StatusCode((int)response.StatusCode, new { error = "NewsAPI Error", details = errorBody });
                }

                var newsResponse = await response.Content.ReadFromJsonAsync<NewsApiResponse>();

                if (newsResponse != null && newsResponse.Status == "ok" && newsResponse.Articles != null)
                {
                    int processedCount = 0;
                    foreach (var article in newsResponse.Articles)
                    {
                        var dto = new NewsPostDTO
                        {
                            Title = article.Title,
                            Description = article.Description,
                            Content = article.Content,
                            Author = article.Author,
                            Url = article.Url,
                            UrlToImage = article.UrlToImage,
                            PublishedAt = article.PublishedAt,
                            Source = new NewsSourceDTO { Name = article.Source?.Name }
                        };

                        var result = await _newsService.ProcessAndSaveArticleAsync(dto);
                        if (result != null) processedCount++;
                    }
                    return Ok(new { message = $"Successfully processed {processedCount} articles.", totalFound = newsResponse.Articles.Count });
                }

                return BadRequest("Failed to fetch news from NewsAPI.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Manual news scrape failed.");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("import")]
        public async Task<ActionResult<NewsPost>> ImportNews([FromBody] NewsPostDTO articleDto)
        {
            var result = await _newsService.ProcessAndSaveArticleAsync(articleDto);
            // Idempotent: If it exists, it returns the existing one, so we just return OK.
            return Ok(result);
        }

        // [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<ActionResult<NewsPost>> CreateNews([FromForm] CreateNewsDto dto)
        {
            try
            {
                Console.WriteLine("User Authenticated: " + User.Identity.IsAuthenticated);
                foreach (var claim in User.Claims)
                {
                    Console.WriteLine($"Claim: {claim.Type} = {claim.Value}");
                }

                if (dto == null)
                {
                    return BadRequest(new { error = "Request data is null" });
                }

                Console.WriteLine($"Attempting to create news: {dto.Title}");

                string urlToImage = null;

                if (dto.Image != null && dto.Image.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "news");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Image.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.Image.CopyToAsync(stream);
                    }

                    urlToImage = $"/uploads/news/{fileName}";
                }

                var newsPost = new NewsPost
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    Content = dto.Content,
                    UrlToImage = urlToImage,
                    Author = "Admin",
                    SourceName = "Arabian Horse System",
                    Url = $"internal-{Guid.NewGuid()}",
                    PublishedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };

                _context.NewsPosts.Add(newsPost);
                await _context.SaveChangesAsync();

                Console.WriteLine($"News created successfully with ID: {newsPost.Id}");
                return CreatedAtAction("GetNewsPost", new { id = newsPost.Id }, newsPost);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating news: {ex.Message}");
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }
    }

    public class SearchDto
    {
        public string Query { get; set; }
    }

    public class CreateNewsDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }
        public IFormFile Image { get; set; }
    }
}

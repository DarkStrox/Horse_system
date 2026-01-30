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
        private const string NewsApiKey = "17d1482fe9844123ac9e27eef48baf6c"; 

        public NewsController(ApplicationDbContext context, NewsService newsService, HttpClient httpClient)
        {
            _context = context;
            _newsService = newsService;
            _httpClient = httpClient;
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

                if (!_httpClient.DefaultRequestHeaders.Contains("User-Agent"))
                {
                    _httpClient.DefaultRequestHeaders.Add("User-Agent", "ArabianHorseSystem-Web");
                }
                
                string url = $"https://newsapi.org/v2/everything?q={Uri.EscapeDataString(search.Query)}&apiKey={NewsApiKey}&sortBy=relevancy&language=en";
                
                var apiResponse = await _httpClient.GetAsync(url);
                if (!apiResponse.IsSuccessStatusCode)
                {
                    var errorContent = await apiResponse.Content.ReadAsStringAsync();
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

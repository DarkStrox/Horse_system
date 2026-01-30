using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using ArabianHorseSystem.Data;
using ArabianHorseSystem.Models;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace ArabianHorseSystem.Services
{
    public class NewsScraperService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<NewsScraperService> _logger;
        private readonly HttpClient _httpClient;
        private const string ApiKey = "17d1482fe9844123ac9e27eef48baf6c";

        public NewsScraperService(IServiceProvider serviceProvider, ILogger<NewsScraperService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
            _httpClient = new HttpClient();
            // User-Agent is required by NewsAPI
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "ArabianHorseSystem-NewsScraper");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("News Scraper Service is starting.");
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await FetchAndSaveNewsAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while fetching news.");
                }

                // Wait for 24 hours before the next fetch
                await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
            }
        }

        private async Task FetchAndSaveNewsAsync()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                
                // Clear existing news to ensure we only have horse-related content
                _logger.LogInformation("Clearing existing news posts for fresh horse-only content.");
                await dbContext.Database.ExecuteSqlRawAsync("TRUNCATE TABLE news_posts RESTART IDENTITY CASCADE");
            }

            string today = DateTime.Now.ToString("yyyy-MM-dd");
            string fromDate = DateTime.Now.AddDays(-7).ToString("yyyy-MM-dd");
            // VERY strict query: Only "Arabian horse" or "Purebred horse"
            // This excludes general "stallion" (music) or "equestrian" (some sports)
            string query = Uri.EscapeDataString("\"Arabian horse\" OR \"Purebred horse\" OR \"Arabian mare\" OR \"Arabian foal\"");
            string url = $"https://newsapi.org/v2/everything?q={query}&from={fromDate}&to={today}&sortBy=publishedAt&language=en&apiKey={ApiKey}";

            _logger.LogInformation("Fetching news from NewsAPI from {FromDate} to {ToDate}", fromDate, today);

            var response = await _httpClient.GetFromJsonAsync<NewsApiResponse>(url);

            if (response != null && response.Status == "ok" && response.Articles != null)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    // Use NewsService
                    var newsService = scope.ServiceProvider.GetRequiredService<NewsService>();

                    foreach (var article in response.Articles)
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

                        await newsService.ProcessAndSaveArticleAsync(dto);
                    }
                    _logger.LogInformation("Successfully processed articles.");
                }
            }
            else
            {
                _logger.LogWarning("NewsAPI response was empty or unsuccessful.");
            }
        }
    }

    // Helper classes for NewsAPI JSON response
    public class NewsApiResponse
    {
        public string Status { get; set; } = string.Empty;
        public int TotalResults { get; set; }
        public List<NewsApiArticle>? Articles { get; set; }
    }

    public class NewsApiArticle
    {
        public NewsApiSource? Source { get; set; }
        public string? Author { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Url { get; set; }
        public string? UrlToImage { get; set; }
        public DateTime PublishedAt { get; set; }
        public string? Content { get; set; }
    }

    public class NewsApiSource
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
    }
}

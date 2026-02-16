using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using ArabianHorseSystem.Data;
using ArabianHorseSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SmartReader;

namespace ArabianHorseSystem.Services
{
    public class NewsService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<NewsService> _logger;
        private readonly HttpClient _httpClient;
        
        // Use a persistent key or configuration
        private const string TranslatorApiKey = "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";

        public NewsService(ApplicationDbContext context, ILogger<NewsService> logger, HttpClient httpClient)
        {
            _context = context;
            _logger = logger;
            _httpClient = httpClient;
        }

        public async Task<NewsPost> ProcessAndSaveArticleAsync(NewsPostDTO rawArticle)
        {
            // 1. Check Duplicates
            if (string.IsNullOrEmpty(rawArticle.Url)) 
            {
                 _logger.LogWarning("Skipping article with empty URL.");
                 return null;
            }

            var existingArticle = await _context.NewsPosts.FirstOrDefaultAsync(n => n.Url == rawArticle.Url);
            if (existingArticle != null)
            {
                _logger.LogInformation("Article already exists: {Url}", rawArticle.Url);
                return existingArticle;
            }

            // 2. Fetch Full Content (if URL is accessible)
            string fullContent = await GetFullArticleContent(rawArticle.Url!);
            string contentToProcess = !string.IsNullOrEmpty(fullContent) ? fullContent : rawArticle.Content;

            // 3. Translate Fields
            string arabicTitle = await TranslateTextAsync(rawArticle.Title ?? "No Title");
            string arabicDesc = await TranslateTextAsync(rawArticle.Description ?? "");
            string arabicContent = await TranslateTextAsync(contentToProcess ?? "");

            // 4. Create Entity
            var newsPost = new NewsPost
            {
                Title = arabicTitle,
                Description = arabicDesc,
                Content = arabicContent,
                Author = rawArticle.Author,
                SourceName = rawArticle.Source?.Name,
                Url = rawArticle.Url!,
                UrlToImage = rawArticle.UrlToImage,
                PublishedAt = rawArticle.PublishedAt ?? DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.NewsPosts.Add(newsPost);
            await _context.SaveChangesAsync();

            return newsPost;
        }

        public async Task<string?> GetFullArticleContent(string url)
        {
            try
            {
                var reader = new Reader(url);
                var article = await reader.GetArticleAsync();
                return article.IsReadable ? article.Content : null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("SmartReader failed for {Url}: {Message}", url, ex.Message);
                return null;
            }
        }

        public async Task<string> TranslateTextAsync(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return text;
            
            // Limit text size for CLI passing
            if (text.Length > 10000) text = text.Substring(0, 10000);

            try
            {
                // Run translate_news.py via Python
                // We pass the text via stdin to avoid shell escaping issues and length limits
                var startInfo = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = @"C:\Users\super\anaconda3\python.exe", // Explicit path from environment check
                    Arguments = "translate_news.py",
                    RedirectStandardInput = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    StandardInputEncoding = System.Text.Encoding.UTF8,
                    StandardOutputEncoding = System.Text.Encoding.UTF8,
                    StandardErrorEncoding = System.Text.Encoding.UTF8
                };

                // Enforce UTF8 for Python output
                startInfo.EnvironmentVariables["PYTHONIOENCODING"] = "utf-8";

                // Adjust WorkingDirectory if needed to find translate_news.py
                // Finding root project dir relative to bin
                string rootPath = AppDomain.CurrentDomain.BaseDirectory;
                while (!System.IO.File.Exists(System.IO.Path.Combine(rootPath, "translate_news.py")) && 
                       System.IO.Directory.GetParent(rootPath) != null)
                {
                    rootPath = System.IO.Directory.GetParent(rootPath).FullName;
                }
                startInfo.WorkingDirectory = rootPath;

                using var process = System.Diagnostics.Process.Start(startInfo);
                if (process == null) return text;

                using (var sw = process.StandardInput)
                {
                    if (sw.BaseStream.CanWrite)
                    {
                        await sw.WriteAsync(text);
                    }
                }

                string result = await process.StandardOutput.ReadToEndAsync();
                string error = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                if (process.ExitCode != 0)
                {
                    _logger.LogError("Python translation script failed with code {Code}: {Error}", process.ExitCode, error);
                    return text;
                }

                // The script currently prints "Original: ..." and "Translated: ..." when run as main.
                // We need to modify the script to just output the result or parse it.
                // For now, let's look for the translated part.
                if (result.Contains("Translated: "))
                {
                    return result.Split("Translated: ").Last().Trim();
                }

                return !string.IsNullOrWhiteSpace(result) ? result.Trim() : text;
            }
            catch (Exception ex)
            {
                _logger.LogError("Translation failed via Python process: {Message}", ex.Message);
                return text;
            }
        }
    }

    public class NewsPostDTO
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public string? Author { get; set; }
        public string? Url { get; set; }
        public string? UrlToImage { get; set; }
        public DateTime? PublishedAt { get; set; }
        public NewsSourceDTO? Source { get; set; }
    }

    public class NewsSourceDTO
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
    }

    public class OpenRouterResponse
    {
        public List<OpenRouterChoice> choices { get; set; }
    }

    public class OpenRouterChoice
    {
        public OpenRouterMessage message { get; set; }
    }

    public class OpenRouterMessage
    {
        public string content { get; set; }
    }
}

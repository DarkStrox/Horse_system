using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArabianHorseSystem.Models
{
    public class NewsPost
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public string? Content { get; set; }

        public string? Author { get; set; }

        public string? SourceName { get; set; }

        [Required]
        public string Url { get; set; } = string.Empty;

        public string? UrlToImage { get; set; }

        public DateTime PublishedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

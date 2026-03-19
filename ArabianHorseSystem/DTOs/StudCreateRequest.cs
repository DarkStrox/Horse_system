using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.DTOs
{
    public class StudCreateRequest
    {
        [Required]
        public string NameArabic { get; set; } = string.Empty;

        [Required]
        public string NameEnglish { get; set; } = string.Empty;

        public DateTime? EstablishedDate { get; set; }

        public string? Description { get; set; }

        public string? Email { get; set; }

        public string? FacebookUrl { get; set; }

        public string? InstagramUrl { get; set; }

        public string? TwitterUrl { get; set; }

        public string? WebsiteUrl { get; set; }

        public int? LocationId { get; set; }

        public IFormFile? ImageFile { get; set; }

        public IFormFile? VideoFile { get; set; }

        public string? StudType { get; set; }
        public string? City { get; set; }
    }
}
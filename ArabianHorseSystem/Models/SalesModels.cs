using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class HorseSaleRequest
    {
        [Required]
        public string MicrochipId { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public int Age { get; set; }

        public string Gender { get; set; } = "Male"; // Male, Female

        public string Breed { get; set; } = "Arabian";

        public decimal Price { get; set; }

        public string HealthStatus { get; set; } = string.Empty;

        public bool Vaccinated { get; set; }

        public bool HasRacingHistory { get; set; } 

        public string? RacingHistoryDetails { get; set; } 

        public string ClaimLocation { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public string? VideoUrl { get; set; }

        public IFormFile? ImageFile { get; set; }

        public IFormFile? VideoFile { get; set; } 
    }
}

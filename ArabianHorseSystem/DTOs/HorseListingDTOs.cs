using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.DTOs
{
    public class HorseRegistrationRequest
    {
        [Required]
        public string MicrochipId { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        public int Age { get; set; }

        public string Gender { get; set; } = "Male"; // Male, Female

        public string Breed { get; set; } = "Arabian";

        public string HealthStatus { get; set; } = string.Empty;

        public bool Vaccinated { get; set; }

        public bool HasRacingHistory { get; set; } 

        public string? RacingHistoryDetails { get; set; } 

        public string? ImageUrl { get; set; }

        public string? VideoUrl { get; set; }

        public IFormFile? ImageFile { get; set; }

        public IFormFile? VideoFile { get; set; } 
    }

    public class HorseListingRequest
    {
        [Required]
        public string MicrochipId { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public string ClaimLocation { get; set; } = string.Empty;
    }
}

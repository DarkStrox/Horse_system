using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.DTOs
{
    public class JoinRequest
    {
        [Required]
        public string? FullName { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? PhoneNumber { get; set; }

        [Required]
        public string? Role { get; set; } // 'Trainer', 'EquineVet', 'Seller' => 'Owner' with Seller intent

        [Required]
        public string? Motivation { get; set; }

        // Optional specific fields
        public string? NationalId { get; set; } // For ID Card
        public string? LicenseNumber { get; set; } // For Vet/Trainer
        public int? ExperienceYears { get; set; }
    }
}

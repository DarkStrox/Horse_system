using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.DTOs
{
    public class UpdateUserDto
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? NationalId { get; set; }
        public string? Status { get; set; }
        public string? Role { get; set; }
        public string? HowDidYouHear { get; set; }
        
        // Seller specific
        public string? FarmName { get; set; }
        public string? SellerRole { get; set; }
        public string? CommercialRegister { get; set; }
        public int? ExperienceYears { get; set; }
        public string? Address { get; set; }
        
        // Vet specific
        public string? CountryCity { get; set; }
        public string? License { get; set; }
        public string? Specialty { get; set; }
        public string? ClinicsWorkedAt { get; set; }
        public string? VetBio { get; set; }
    }
}

// DTOs/AccountDTOs.cs
namespace ArabianHorseSystem.DTOs
{
    public class RegisterDto
    {
        // أساسي
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? HowDidYouHear { get; set; }
        
        // مشترك للبائع والطبيب والمشتري
        public string? NationalId { get; set; }
        
        // بائع
        public string? SellerType { get; set; }
        public string? FarmName { get; set; }
        public string? Address { get; set; }
        public string? CommercialRegister { get; set; }
        public int? ExperienceYears { get; set; }
        public string? SellerRole { get; set; }
        
        // مشتري
        public string? Governorate { get; set; }
        
        // طبيب بيطري
        public string? CountryCity { get; set; }
        public string? LicenseNumber { get; set; }
        public string? VetSpecialization { get; set; }
        public string? ClinicsWorkedAt { get; set; }
        public string? VetBio { get; set; }
        public bool ConfirmAccuracy { get; set; }
        
        // ملفات
        public IFormFile? NationalIdFile { get; set; }
        public IFormFile? LicenseFile { get; set; }
        public IFormFile? RecommendationLetter { get; set; }
        public IFormFile? VetCertificates { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class EmailDto
    {
        public string Email { get; set; } = string.Empty;
    }
}
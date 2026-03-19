using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.DTOs
{
    public class VetJoinRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;
        public string NationalId { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;

        public int ExperienceYears { get; set; }

        public string Specialization { get; set; } = string.Empty;
        public string PreviousWorkplace { get; set; } = string.Empty;

        public string HorseExperience { get; set; } = string.Empty;

        public IFormFile LicensePdf { get; set; }
        public IFormFile IdCardPdf { get; set; }
        public IFormFile CertificatesPdf { get; set; }
    }


}
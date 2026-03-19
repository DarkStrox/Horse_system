using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.DTOs
{

    public class SellerJoinRequest
    {
        public string FullName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string NationalId { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string ConfirmPassword { get; set; } = string.Empty;

        public string CommercialRegister { get; set; } = string.Empty;

        public string StudName { get; set; } = string.Empty;

        public string StudAddress { get; set; } = string.Empty;

        public string Motivation { get; set; } = string.Empty;

        public IFormFile IdCardPdf { get; set; }

        public IFormFile RecommendationLetterPdf { get; set; }
    }

}
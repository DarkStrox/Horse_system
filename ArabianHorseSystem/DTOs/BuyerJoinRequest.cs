using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.DTOs
{
    public class BuyerJoinRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;

        public string NationalId { get; set; } = string.Empty;

        public string Government { get; set; } = string.Empty;

        public string HowDidYouHearAboutUs { get; set; } = string.Empty;
    }



}
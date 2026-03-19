using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.DTOs
{

    public class SimpleUserRegister
    {
        public string FullName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;
    }

}
using System.ComponentModel.DataAnnotations;
namespace ArabianHorseSystem.DTOs
{
    public class CreateUserDto
    {
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string Role { get; set; } = "";
    }

    public class ChangeRoleDto
    {
        public int UserId { get; set; }
        public string Role { get; set; } = "";
    }
}
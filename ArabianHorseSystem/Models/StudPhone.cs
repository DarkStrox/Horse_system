using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class StudPhone
    {
        [Key]
        public int PhoneId { get; set; }

        public int StudId { get; set; }
        public virtual Stud Stud { get; set; } = null!;

        [Required, MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}

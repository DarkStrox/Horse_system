using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class Stud
    {
        [Key]
        public int StudId { get; set; }

        [Required, MaxLength(150)]
        public string NameArabic { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string NameEnglish { get; set; } = string.Empty;

        public DateTime? EstablishedDate { get; set; }

        public string? Description { get; set; }

        [MaxLength(150)]
        public string? Email { get; set; }

        [MaxLength(255)]
        public string? FacebookUrl { get; set; }

        [MaxLength(255)]
        public string? InstagramUrl { get; set; }

        [MaxLength(255)]
        public string? TwitterUrl { get; set; }

        [MaxLength(255)]
        public string? WebsiteUrl { get; set; }

        [MaxLength(255)]
        public string? ImageUrl { get; set; }

        [MaxLength(255)]
        public string? VideoUrl { get; set; }

        [MaxLength(50)]
        public string? StudType { get; set; }

        public int StallCapacity { get; set; }

        public decimal BoardingPrice { get; set; }

        public int NumOfHorses { get; set; }

        public int NumOfMales { get; set; }

        public int NumOfFemales { get; set; }

        public int? LocationId { get; set; }
        public virtual Location? Location { get; set; }

        public virtual ICollection<StudPhone> Phones { get; set; } = new List<StudPhone>();
        public virtual ICollection<HorseProfile> Horses { get; set; } = new List<HorseProfile>();
    }
}
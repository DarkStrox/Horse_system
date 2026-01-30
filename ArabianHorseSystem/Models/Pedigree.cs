using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class Pedigree
    {
        [Key]
        public int PedId { get; set; }

        [MaxLength(150)]
        public string? FatherHorseName { get; set; }

        [MaxLength(150)]
        public string? MotherHorseName { get; set; }

        public string? LineageNotes { get; set; }

        public virtual ICollection<HorseProfile> Horses { get; set; } = new List<HorseProfile>();
    }
}

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class Colour
    {
        [Key]
        public int ColourId { get; set; }

        [Required, MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<HorseProfile> Horses { get; set; } = new List<HorseProfile>();
    }
}

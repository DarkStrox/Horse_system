using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class Location
    {
        [Key]
        public int LocationId { get; set; }
        
        [Required, MaxLength(100)]
        public string Government { get; set; } = string.Empty;
        
        [Required, MaxLength(100)]
        public string City { get; set; } = string.Empty;
        
        [Required]
        public string Address { get; set; } = string.Empty;

        // Navigation properties
        public virtual ICollection<Stud> Studs { get; set; } = new List<Stud>();
        public virtual ICollection<Manege> Maneges { get; set; } = new List<Manege>();
        public virtual ICollection<Auction> Auctions { get; set; } = new List<Auction>();
    }
}

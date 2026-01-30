using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class HorseProfile
    {
        [Key, MaxLength(50)]
        public string MicrochipId { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        public int? Age { get; set; }

        [MaxLength(10)]
        public string? Gender { get; set; } // Mare, Stallion, Gelding, Filly, Colt

        [MaxLength(50)]
        public string Breed { get; set; } = "Arabian";

        [MaxLength(50)]
        public string LifeStatus { get; set; } = "Alive"; // Alive, Deceased

        public DateTime? Birthdate { get; set; }

        [MaxLength(255)]
        public string? ImageUrl { get; set; }

        [MaxLength(255)]
        public string? VideoUrl { get; set; }

        [MaxLength(255)]
        public string? PedigreeImageUrl { get; set; }

        // Foreign Keys
        public int? ColourId { get; set; }
        public virtual Colour? Colour { get; set; }

        public int? OwnerId { get; set; }
        public virtual Owner? Owner { get; set; }

        public int? StudId { get; set; }
        public virtual Stud? Stud { get; set; }

        public int? PedId { get; set; }
        public virtual Pedigree? Pedigree { get; set; }

        // Sales Info
        public decimal? Price { get; set; }
        public bool IsForSale { get; set; } = false;
        public bool IsApproved { get; set; } = false; // Admin approval
        
        [MaxLength(50)]
        public string? HealthStatus { get; set; } // "Healthy", "Injured", etc.
        
        public bool Vaccinated { get; set; } = false;
        
        [MaxLength(255)]
        public string? RacingHistory { get; set; } // "Won 3 races", "No history"
        
        [MaxLength(255)]
        public string? ClaimLocation { get; set; } // Where to pick up

        // Navigation properties
        public virtual ICollection<HorseTrainingEnrollment> Enrollments { get; set; } = new List<HorseTrainingEnrollment>();
        public virtual ICollection<HealthRecord> HealthRecords { get; set; } = new List<HealthRecord>();
        public virtual ICollection<Auction> Auctions { get; set; } = new List<Auction>();
    }
}

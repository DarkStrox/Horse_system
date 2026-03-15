using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArabianHorseSystem.Models
{
    public class Owner
    {
        [Key, ForeignKey("User")]
        public int OwnerId { get; set; }

        public string? Preferences { get; set; } // Map to JSONB in DbContext
        public DateTime Since { get; set; } = DateTime.UtcNow;

        // Seller Specific Fields
        public string? SellerType { get; set; } // 'individual' or 'institution'
        public string? FarmName { get; set; }
        public string? Address { get; set; }
        public string? CommercialRegister { get; set; }
        public int ExperienceYears { get; set; }
        public string? SellerRole { get; set; }
        
        // URLs for uploaded documents
        public string? NationalIdFileUrl { get; set; }
        public string? RecommendationLetterUrl { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual ICollection<HorseProfile> Horses { get; set; } = new List<HorseProfile>();
    }
}

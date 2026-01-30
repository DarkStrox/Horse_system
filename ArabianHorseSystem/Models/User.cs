using System;
using Microsoft.AspNetCore.Identity;

namespace ArabianHorseSystem.Models
{
    public class User : IdentityUser<int>
    {
        public string? FullName { get; set; }
        public string? Role { get; set; } // 'Admin', 'Owner', 'Trainer', 'EquineVet', 'Buyer'
        public string? Bio { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastPasswordChangedAt { get; set; }
        
        // Auction Features
        public bool IsVerifiedBidder { get; set; } = false; // Has paid insurance

        // Navigation Properties (1:1 Relationships)
        public virtual Owner? OwnerProfile { get; set; }
        public virtual Trainer? TrainerProfile { get; set; }
        public virtual EquineVet? VetProfile { get; set; }
    }
}

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArabianHorseSystem.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SenderId { get; set; } // User Id of the sender

        [Required]
        public int ReceiverId { get; set; } // User Id of the receiver (derived from Horse Owner)

        public string? HorseId { get; set; } // Optional: Related to a specific horse

        [Required]
        public string Content { get; set; }

        public string Subject { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;

        // Navigation properties if needed (might skip complex relationships for now to avoid migration hell if not strictly necessary, but FKs are good practice)
        // Keeping it simple with strings for IDs to match typical IdentityUser usage without forcing strict FK constraints immediately if migrations are tough.
        // However, standard EF Core practice is best.
        
        [ForeignKey("SenderId")]
        public virtual User Sender { get; set; }

        [ForeignKey("ReceiverId")]
        public virtual User Receiver { get; set; }
    }
}

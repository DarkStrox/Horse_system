using System;
using System.ComponentModel.DataAnnotations;

namespace ArabianHorseSystem.Models
{
    public class Auction
    {
        [Key]
        public int AuctionId { get; set; }

        [MaxLength(150)]
        public string? Name { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        
        public decimal BasePrice { get; set; }
        public decimal CurrentBid { get; set; }
        public decimal MinimumIncrement { get; set; } = 1000; // Minimum bid increase
        
        [MaxLength(255)]
        public string? VideoUrl { get; set; }

        [MaxLength(255)]
        public string? ImageUrl { get; set; }

        public string Status { get; set; } = "Pending"; // Upcoming, Live, Ended, WaitingForSeller, Completed, Cancelled
        
        public string? InsuranceDetails { get; set; }

        // Relationships
        public int? LocationId { get; set; }
        public virtual Location? Location { get; set; }

        [MaxLength(50)]
        public string? MicrochipId { get; set; }
        public virtual HorseProfile? Horse { get; set; }

        public int? CreatedById { get; set; }
        public virtual User? CreatedBy { get; set; }

        public int? WinnerId { get; set; }
        public virtual User? Winner { get; set; }
        
        public virtual ICollection<Bid> Bids { get; set; } = new List<Bid>();
    }
}

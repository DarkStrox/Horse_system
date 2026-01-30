using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArabianHorseSystem.Models
{
    public class Bid
    {
        [Key]
        public int Id { get; set; }

        public int AuctionId { get; set; }
        [ForeignKey("AuctionId")]
        public virtual Auction Auction { get; set; }

        public int BidderId { get; set; }
        [ForeignKey("BidderId")]
        public virtual User Bidder { get; set; }

        public decimal Amount { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}

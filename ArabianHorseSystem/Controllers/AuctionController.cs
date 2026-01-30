using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArabianHorseSystem.Data;
using ArabianHorseSystem.Models;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace ArabianHorseSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuctionController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuctionController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/auction
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAuctions()
        {
            var now = DateTime.UtcNow;
            
            // Auto-update statuses (Mock Scheduled Task)
            var pendingToLive = await _context.Auctions
                .Where(a => a.Status == "Upcoming" && a.StartTime <= now)
                .ToListAsync();
            foreach(var a in pendingToLive) a.Status = "Live";

            var liveToEnded = await _context.Auctions
                .Where(a => a.Status == "Live" && a.EndTime <= now)
                .ToListAsync();
            foreach(var a in liveToEnded) a.Status = "WaitingForSeller";

            if (pendingToLive.Any() || liveToEnded.Any()) await _context.SaveChangesAsync();

            var auctions = await _context.Auctions
                .Include(a => a.Horse)
                .Include(a => a.Bids)
                .OrderByDescending(a => a.StartTime)
                .Select(a => new {
                    a.AuctionId,
                    a.Name,
                    a.StartTime,
                    a.EndTime,
                    a.BasePrice,
                    a.CurrentBid,
                    a.Status,
                    a.VideoUrl,
                    a.ImageUrl,
                    HorseName = a.Horse.Name,
                    HorseImage = a.Horse.ImageUrl,
                    HorseBreed = a.Horse.Breed,
                    BidCount = a.Bids.Count
                })
                .ToListAsync();

            return Ok(auctions);
        }

        // GET: api/auction/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetAuction(int id)
        {
            var auction = await _context.Auctions
                .Include(a => a.Horse).ThenInclude(h => h.Owner).ThenInclude(o => o.User)
                .Include(a => a.Bids).ThenInclude(b => b.Bidder)
                .FirstOrDefaultAsync(a => a.AuctionId == id);

            if (auction == null) return NotFound();

            return Ok(new
            {
                auction.AuctionId,
                auction.Name,
                auction.StartTime,
                auction.EndTime,
                auction.BasePrice,
                auction.CurrentBid,
                auction.MinimumIncrement,
                auction.Status,
                auction.VideoUrl,
                auction.ImageUrl,
                auction.CreatedById,
                auction.WinnerId,
                Horse = auction.Horse, // Serializes full horse profile
                Bids = auction.Bids.OrderByDescending(b => b.Amount).Select(b => new {
                    b.Id,
                    b.Amount,
                    b.Timestamp,
                    BidderName = b.Bidder.FullName
                })
            });
        }

        // POST: api/auction/create
        [HttpPost("create")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> CreateAuction([FromForm] CreateAuctionDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            // Validate Horse Ownership (if Seller)
            var horse = await _context.HorseProfiles.Include(h => h.Owner).FirstOrDefaultAsync(h => h.MicrochipId == dto.MicrochipId);
            if (horse == null) return NotFound("Horse not found");

            if (userRole == "Seller" && horse.Owner.User.Id != userId)
                return Forbid("You can only auction your own horses.");

            // Handle File Uploads
            string? imageUrl = null;
            string? videoUrl = dto.VideoUrl; // Fallback to link if provided, or override

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create)) await dto.ImageFile.CopyToAsync(stream);
                imageUrl = "/uploads/" + fileName;
            }

            if (dto.VideoFile != null && dto.VideoFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.VideoFile.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create)) await dto.VideoFile.CopyToAsync(stream);
                videoUrl = "/uploads/" + fileName; // Override link if file is uploaded
            }

            var auction = new Auction
            {
                Name = dto.Name,
                StartTime = dto.StartTime.ToUniversalTime(),
                EndTime = dto.EndTime.ToUniversalTime(),
                BasePrice = dto.BasePrice,
                CurrentBid = dto.BasePrice,
                VideoUrl = videoUrl,
                ImageUrl = imageUrl,
                MicrochipId = dto.MicrochipId,
                CreatedById = userId,
                Status = DateTime.UtcNow >= dto.StartTime.ToUniversalTime() ? "Live" : "Upcoming"
            };

            _context.Auctions.Add(auction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Auction created successfully", id = auction.AuctionId });
        }

        // DELETE: api/auction/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAuction(int id)
        {
            var auction = await _context.Auctions.FindAsync(id);
            if (auction == null) return NotFound();

            _context.Auctions.Remove(auction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Auction deleted successfully" });
        }

        // POST: api/auction/{id}/bid
        [HttpPost("{id}/bid")]
        [Authorize]
        public async Task<IActionResult> PlaceBid(int id, [FromBody] BidDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);

            if (!user.IsVerifiedBidder)
                return BadRequest("You must pay the insurance deposit to bid.");

            var auction = await _context.Auctions.FindAsync(id);
            if (auction == null) return NotFound();

            if (auction.Status != "Live")
                return BadRequest("Auction is not live.");

            if (DateTime.UtcNow > auction.EndTime)
                return BadRequest("Auction has ended.");

            if (dto.Amount < auction.CurrentBid + auction.MinimumIncrement)
                return BadRequest($"Bid must be at least {auction.CurrentBid + auction.MinimumIncrement}");

            var bid = new Bid
            {
                AuctionId = id,
                BidderId = userId,
                Amount = dto.Amount
            };

            auction.CurrentBid = dto.Amount;
            auction.Bids.Add(bid);
            
            // Notify Seller (Mock)
            // _notificationService.Notify(auction.CreatedById, "New Bid placed");

            await _context.SaveChangesAsync();

            return Ok(new { message = "Bid placed successfully", currentBid = auction.CurrentBid });
        }

        // POST: api/auction/pay-insurance
        [HttpPost("pay-insurance")]
        [Authorize]
        public async Task<IActionResult> PayInsurance()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);
            
            user.IsVerifiedBidder = true;
            user.Role = "Buyer"; // Upgrade role
            await _context.SaveChangesAsync();

            return Ok(new { message = "Insurance paid. You are now a verified bidder." });
        }

        // POST: api/auction/{id}/accept
        [HttpPost("{id}/accept")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> AcceptWinner(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var auction = await _context.Auctions
                .Include(a => a.Bids)
                .Include(a => a.Horse)
                .FirstOrDefaultAsync(a => a.AuctionId == id);

            if (auction == null) return NotFound();
            if (auction.CreatedById != userId && !User.IsInRole("Admin")) return Forbid();

            var winningBid = auction.Bids.OrderByDescending(b => b.Amount).FirstOrDefault();
            if (winningBid == null) return BadRequest("No bids to accept.");

            auction.Status = "Completed";
            auction.WinnerId = winningBid.BidderId;

            // Usage: Transfer Ownership
            // This logic assumes we have a way to fetch the Owner Profile of the winner.
            // If the winner is just a User/Buyer, they might not have an Owner profile yet.
            // For simplicity, we'll verify if they have an Owner profile, if not create one?
            // Or just allow 'Buyer' to own horses. The system currently links Horse -> Owner -> User.
            // So we need an Owner entity for the winner.
            
            var winnerOwner = await _context.Owners.FirstOrDefaultAsync(o => o.OwnerId == winningBid.BidderId);
            if (winnerOwner == null)
            {
                // Create Owner profile for the buyer
                winnerOwner = new Owner { OwnerId = winningBid.BidderId };
                _context.Owners.Add(winnerOwner);
                await _context.SaveChangesAsync(); 
            }

            // Transfer Horse
            auction.Horse.OwnerId = winnerOwner.OwnerId;
            auction.Horse.IsForSale = false; // Delist from standard sales

            await _context.SaveChangesAsync();

            return Ok(new { message = "Winner accepted. Ownership transferred." });
        }
        
        // POST: api/auction/{id}/close
        [HttpPost("{id}/close")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CloseAuction(int id)
        {
             var auction = await _context.Auctions.FindAsync(id);
             if (auction == null) return NotFound();
             
             auction.Status = "Ended";
             auction.EndTime = DateTime.UtcNow;
             await _context.SaveChangesAsync();
             
             return Ok(new { message = "Auction closed." });
        }
    }

    public class CreateAuctionDto
    {
        public string Name { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public decimal BasePrice { get; set; }
        public string? VideoUrl { get; set; }
        public string MicrochipId { get; set; }
        public IFormFile? ImageFile { get; set; }
        public IFormFile? VideoFile { get; set; }
    }

    public class BidDto
    {
        public decimal Amount { get; set; }
    }
}

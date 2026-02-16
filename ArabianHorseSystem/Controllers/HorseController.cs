using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ArabianHorseSystem.Data;
using ArabianHorseSystem.Models;
using ArabianHorseSystem.DTOs;
using ArabianHorseSystem.Services;

namespace ArabianHorseSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HorseController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly NotificationService _notificationService;
        private readonly UserManager<ArabianHorseSystem.Models.User> _userManager;

        public HorseController(ApplicationDbContext context, NotificationService notificationService, UserManager<ArabianHorseSystem.Models.User> userManager)
        {
            _context = context;
            _notificationService = notificationService;
            _userManager = userManager;
        }

        // GET: api/horse/sales
        [HttpGet("sales")]
        public async Task<IActionResult> GetHorsesForSale()
        {
            var horses = await _context.HorseProfiles
                .Include(h => h.Owner)
                .ThenInclude(o => o.User)
                .Where(h => h.IsForSale && h.IsApproved)
                .Select(h => new
                {
                    h.MicrochipId,
                    h.Name,
                    h.Age,
                    h.Price,
                    h.Breed,
                    h.Gender,
                    h.ImageUrl,
                    // Use Owner's User FullName if available
                    OwnerName = h.Owner != null && h.Owner.User != null ? h.Owner.User.FullName : "Unknown",
                    h.Pedigree
                })
                .ToListAsync();

            return Ok(horses);
        }

        // POST: api/horse
        [HttpPost]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> RegisterHorse([FromForm] HorseRegistrationRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null) return Unauthorized();

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

            // Handle Image Upload
            string? imageUrl = null;
            if (model.ImageFile != null && model.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "horses");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ImageFile.CopyToAsync(stream);
                }
                imageUrl = "/uploads/horses/" + uniqueFileName;
            }
            else
            {
                imageUrl = model.ImageUrl;
            }

            // Handle Video Upload
            string? videoUrl = null;
            if (model.VideoFile != null && model.VideoFile.Length > 0)
            {
                 var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "horses");
                 if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                 
                 var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.VideoFile.FileName;
                 var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                 
                 using (var stream = new FileStream(filePath, FileMode.Create))
                 {
                     await model.VideoFile.CopyToAsync(stream);
                 }
                 videoUrl = "/uploads/horses/" + uniqueFileName;
            }
            else
            {
                videoUrl = model.VideoUrl;
            }

            // Check if horse with MicrochipId already exists
            if (await _context.HorseProfiles.AnyAsync(h => h.MicrochipId == model.MicrochipId))
            {
                return BadRequest(new { message = "Horse with this Microchip ID already exists." });
            }

            var owner = await _context.Owners.FirstOrDefaultAsync(o => o.OwnerId == user.Id);
            if (owner == null)
            {
                owner = new Owner { OwnerId = user.Id };
                _context.Owners.Add(owner);
                await _context.SaveChangesAsync();
            }

            var horse = new HorseProfile
            {
                MicrochipId = model.MicrochipId,
                Name = model.Name,
                Age = model.Age,
                Gender = model.Gender,
                Breed = model.Breed,
                IsForSale = false, // Just registering to system
                IsApproved = true,  // System registration is auto-approved
                HealthStatus = model.HealthStatus,
                Vaccinated = model.Vaccinated,
                RacingHistory = model.HasRacingHistory ? model.RacingHistoryDetails : "None",
                ImageUrl = imageUrl,
                VideoUrl = videoUrl,
                OwnerId = owner.OwnerId
            };

            _context.HorseProfiles.Add(horse);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Horse registered in system successfully.", horseId = horse.MicrochipId });
        }

        // PUT: api/horse/list-for-sale
        [HttpPut("list-for-sale")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> ListHorseForSale([FromBody] HorseListingRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null) return Unauthorized();

            var horse = await _context.HorseProfiles.FirstOrDefaultAsync(h => h.MicrochipId == model.MicrochipId);
            if (horse == null) return NotFound(new { message = "Horse not found." });

            // Ensure owner or admin
            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            if (!isAdmin && horse.OwnerId != user.Id)
            {
                return Forbid();
            }

            horse.Price = model.Price;
            horse.ClaimLocation = model.ClaimLocation;
            horse.IsForSale = true;
            horse.IsApproved = isAdmin; // Auto-approve if Admin

            await _context.SaveChangesAsync();

            if (!isAdmin)
            {
                // Create notification for admin approval
                var saleRequest = new HorseSaleRequest
                {
                    MicrochipId = horse.MicrochipId,
                    Name = horse.Name,
                    Price = model.Price,
                    ClaimLocation = model.ClaimLocation
                };
                await _notificationService.AddHorseSaleNotificationAsync(saleRequest, user.Id.ToString());
                return Ok(new { message = "Sale request sent to Admin for approval." });
            }

            return Ok(new { message = "Horse listed for sale successfully." });
        }

        [HttpPost("sell")]
        [Authorize(Roles = "Seller,Admin")]
        public async Task<IActionResult> PostHorseForSale([FromForm] HorseSaleRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null) return Unauthorized();

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

            // Handle Image Upload
            string? imageUrl = null;
            if (model.ImageFile != null && model.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "horses");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.ImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ImageFile.CopyToAsync(stream);
                }
                imageUrl = "/uploads/horses/" + uniqueFileName;
            }
            else
            {
                imageUrl = model.ImageUrl; // Fallback to URL if provided
            }

            // Handle Video Upload
            string? videoUrl = null;
            if (model.VideoFile != null && model.VideoFile.Length > 0)
            {
                 var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "horses");
                 if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                 
                 var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.VideoFile.FileName;
                 var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                 
                 using (var stream = new FileStream(filePath, FileMode.Create))
                 {
                     await model.VideoFile.CopyToAsync(stream);
                 }
                 videoUrl = "/uploads/horses/" + uniqueFileName;
            }
            else
            {
                videoUrl = model.VideoUrl;
            }

            // Check if horse with MicrochipId already exists
            if (await _context.HorseProfiles.AnyAsync(h => h.MicrochipId == model.MicrochipId))
            {
                return BadRequest(new { message = "Horse with this Microchip ID already exists." });
            }

            var owner = await _context.Owners.FirstOrDefaultAsync(o => o.OwnerId == user.Id);
            if (owner == null)
            {
                owner = new Owner { OwnerId = user.Id };
                _context.Owners.Add(owner);
                await _context.SaveChangesAsync();
            }

            var horse = new HorseProfile
            {
                MicrochipId = model.MicrochipId,
                Name = model.Name,
                Age = model.Age,
                Gender = model.Gender,
                Breed = model.Breed,
                Price = model.Price,
                IsForSale = true,
                IsApproved = isAdmin, // Auto-approve if Admin
                HealthStatus = model.HealthStatus,
                Vaccinated = model.Vaccinated,
                RacingHistory = model.HasRacingHistory ? model.RacingHistoryDetails : "None",
                ClaimLocation = model.ClaimLocation,
                ImageUrl = imageUrl,
                VideoUrl = videoUrl,
                OwnerId = owner.OwnerId
            };

            _context.HorseProfiles.Add(horse);
            await _context.SaveChangesAsync();

            if (!isAdmin)
            {
                await _notificationService.AddHorseSaleNotificationAsync(model, user.Id.ToString());
                return Ok(new { message = "Request sent to Admin for approval." });
            }

            return Ok(new { message = "Horse added successfully.", horseId = horse.MicrochipId });
        }

        // DELETE: api/horse/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteHorse(string id)
        {
            var horse = await _context.HorseProfiles.FindAsync(id);
            if (horse == null)
            {
                return NotFound();
            }

            _context.HorseProfiles.Remove(horse);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        // GET: api/horse/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHorse(string id)
        {
             // Try int ID or string MicrochipId logic if needed, for now assume primary key is string MicrochipId? 
             // Wait, HorseProfile Key is MicrochipId (string).
             var horse = await _context.HorseProfiles
                .Include(h => h.Owner).ThenInclude(o => o.User)
                .Include(h => h.Pedigree)
                .FirstOrDefaultAsync(h => h.MicrochipId == id);

             if (horse == null) return NotFound();

             return Ok(horse);
        }
        // GET: api/horse/my-horses
        [HttpGet("my-horses")]
        [Authorize]
        public async Task<IActionResult> GetMyHorses()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            if (user == null) return Unauthorized();

            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

            var query = _context.HorseProfiles.AsQueryable();

            // If not Admin, filter by ownership
            if (!isAdmin)
            {
                query = query.Where(h => h.OwnerId == user.Id);
            }

            var horses = await query
                .Select(h => new 
                {
                    h.MicrochipId,
                    h.Name,
                    h.Breed,
                    h.ImageUrl
                })
                .ToListAsync();

            return Ok(horses);
        }
    }
}

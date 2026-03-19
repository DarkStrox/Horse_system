using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
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

        // GET: api/horse/stud/{studId}
        [HttpGet("stud/{studId}")]
        public async Task<IActionResult> GetHorsesByStud(int studId)
        {
            var horses = await _context.HorseProfiles
                .Include(h => h.Owner).ThenInclude(o => o.User)
                .Include(h => h.Stud)
                .Include(h => h.Pedigree)
                .Include(h => h.Colour)
                .Where(h => h.StudId == studId)
                .Select(h => new 
                {
                    Id = h.MicrochipId,
                    h.Name,
                    h.Breed,
                    Type = h.Gender, // Mapping Gender to Type as used in StudDetails
                    Color = h.Colour != null ? h.Colour.Name : "Unknown",
                    Birth = h.Age.HasValue ? h.Age.Value.ToString() : "Unknown",
                    Img = h.ImageUrl ?? "/horses/profile_main.png",
                    Owner = h.Owner != null && h.Owner.User != null ? h.Owner.User.FullName : "Unknown",
                    Branch = "Main", // Placeholder
                    h.MicrochipId
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

            // Handle Pedigree Image Upload
            string? pedigreeImageUrl = null;
            if (model.PedigreeImageFile != null && model.PedigreeImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "pedigrees");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.PedigreeImageFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.PedigreeImageFile.CopyToAsync(stream);
                }
                pedigreeImageUrl = "/uploads/pedigrees/" + uniqueFileName;
            }

            // Handle Health Report PDF (using HealthReportFile from model if present)
            string? healthReportUrl = null;
            if (model.HealthReportFile != null && model.HealthReportFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "health");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
                
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + model.HealthReportFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.HealthReportFile.CopyToAsync(stream);
                }
                healthReportUrl = "/uploads/health/" + uniqueFileName;
            }

            // Handle Color mapping
            int? colourId = null;
            if (!string.IsNullOrEmpty(model.ColorName))
            {
                var colour = await _context.Colours.FirstOrDefaultAsync(c => c.Name == model.ColorName);
                if (colour == null)
                {
                    colour = new Colour { Name = model.ColorName };
                    _context.Colours.Add(colour);
                    await _context.SaveChangesAsync();
                }
                colourId = colour.ColourId;
            }

            // Handle Stud mapping
            int? studId = model.StudId;
            if (!studId.HasValue && !string.IsNullOrEmpty(model.StudName))
            {
                // Try to find stud by name (checking both Arabic and English fields)
                var stud = await _context.Studs.FirstOrDefaultAsync(s => s.NameArabic == model.StudName || s.NameEnglish == model.StudName);
                if (stud != null)
                {
                    studId = stud.StudId;
                }
            }

            // Handle Pedigree Record
            Pedigree? pedigree = null;
            if (!string.IsNullOrEmpty(model.Sire) || !string.IsNullOrEmpty(model.Dam))
            {
                pedigree = new Pedigree
                {
                    FatherHorseName = model.Sire,
                    MotherHorseName = model.Dam
                };
                _context.Pedigrees.Add(pedigree);
                await _context.SaveChangesAsync();
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
                IsForSale = false, 
                IsApproved = true,  
                HealthStatus = model.HealthStatus,
                Vaccinated = model.Vaccinated,
                RacingHistory = model.HasRacingHistory ? model.RacingHistoryDetails : "None",
                ImageUrl = imageUrl,
                VideoUrl = videoUrl,
                PedigreeImageUrl = pedigreeImageUrl,
                HealthReportUrl = healthReportUrl,
                OwnerId = owner.OwnerId,
                StudId = studId,
                Breeder = model.Breeder,
                ColourId = colourId,
                PedId = pedigree?.PedId
            };

            _context.HorseProfiles.Add(horse);

            // Add an initial health record if diagnosis/treatment provided
            if (!string.IsNullOrEmpty(model.Diagnosis) || !string.IsNullOrEmpty(model.Treatment))
            {
                var healthRecord = new HealthRecord
                {
                    MicrochipId = horse.MicrochipId,
                    Diagnosis = model.Diagnosis ?? "General Checkup",
                    Treatment = model.Treatment ?? "None",
                    Notes = model.Notes,
                    VisitDate = DateTime.UtcNow
                };
                _context.HealthRecords.Add(healthRecord);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Horse registered in system successfully.", horseId = horse.MicrochipId, imageUrl = horse.ImageUrl });
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

            // Handle Health Report PDF
            string? healthReportUrl = null;

            if (model.HealthReportFile != null)
            {
                if (model.HealthReportFile.ContentType != "application/pdf")
                    return BadRequest("Only PDF files are allowed.");

                if (model.HealthReportFile.Length > 5 * 1024 * 1024)
                    return BadRequest("File size must be less than 5MB.");

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "health");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + ".pdf";

                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.HealthReportFile.CopyToAsync(stream);
                }

                healthReportUrl = "/uploads/health/" + uniqueFileName;
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
                HealthReportUrl = healthReportUrl,
                Vaccinated = model.Vaccinated,
                RacingHistory = model.HasRacingHistory ? model.RacingHistoryDetails : "None",
                ClaimLocation = model.ClaimLocation,
                ImageUrl = imageUrl,
                VideoUrl = videoUrl,
                OwnerId = owner.OwnerId
            };

            _context.HorseProfiles.Add(horse);

            var healthRecord = new HealthRecord
            {
                MicrochipId = horse.MicrochipId,
                Diagnosis = model.Diagnosis,
                Treatment = model.Treatment,
                Notes = model.Notes,
                VisitDate = DateTime.UtcNow
            };

            _context.HealthRecords.Add(healthRecord);
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
        
        // GET: api/horse
        [HttpGet]
        public async Task<IActionResult> GetAllHorses()
        {
            var horses = await _context.HorseProfiles
                .Include(h => h.Owner).ThenInclude(o => o.User)
                .Include(h => h.Stud)
                .Include(h => h.Pedigree)
                .Where(h => h.IsApproved)
                .Select(h => new 
                {
                    Id = h.MicrochipId,
                    h.Name,
                    h.Breed,
                    h.Gender,
                    h.Age,
                    h.Breeder,
                    Owner = h.Owner != null && h.Owner.User != null ? h.Owner.User.FullName : "Unknown",
                    StudName = h.Stud != null ? h.Stud.NameArabic : "None",
                    StudBranch = "Main",
                    Sire = h.Pedigree != null ? h.Pedigree.FatherHorseName : "Unknown",
                    Dam = h.Pedigree != null ? h.Pedigree.MotherHorseName : "Unknown",
                    h.ImageUrl,
                    h.IsApproved,
                    IsActive = h.IsApproved
                })
                .ToListAsync();

            return Ok(horses);
        }

        // GET: api/horse/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHorse(string id)
        {
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
                .Include(h => h.Owner).ThenInclude(o => o.User)
                .Include(h => h.Stud)
                .Include(h => h.Pedigree)
                .Select(h => new 
                {
                    Id = h.MicrochipId,
                    h.Name,
                    h.Breed,
                    h.Gender,
                    h.Age,
                    h.Breeder,
                    Owner = h.Owner != null && h.Owner.User != null ? h.Owner.User.FullName : "Unknown",
                    StudName = h.Stud != null ? h.Stud.NameArabic : "None",
                    StudBranch = "Main", // Stud model has no Branch field yet
                    Sire = h.Pedigree != null ? h.Pedigree.FatherHorseName : "Unknown",
                    Dam = h.Pedigree != null ? h.Pedigree.MotherHorseName : "Unknown",
                    h.ImageUrl,
                    h.IsApproved,
                    IsActive = h.IsApproved
                })
                .ToListAsync();

            return Ok(horses);
        }
    }
}

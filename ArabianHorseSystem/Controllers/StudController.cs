using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ArabianHorseSystem.Data;
using ArabianHorseSystem.Models;
using ArabianHorseSystem.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ArabianHorseSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/stud
        [HttpGet]
        public async Task<IActionResult> GetAllStuds()
        {
            var studs = await _context.Studs
                .Include(s => s.Location)
                .Select(s => new
                {
                    Id = s.StudId,
                    Name = s.NameArabic, 
                    NameArabic = s.NameArabic,
                    NameEnglish = s.NameEnglish,
                    Type = s.StudType,
                    Img = s.ImageUrl ?? "/horses/profile_main.png",
                    IsFeatured = true, 
                    Stats = new
                    {
                        Offspring = s.NumOfHorses,
                        Mares = s.NumOfFemales,
                        Stallions = s.NumOfMales,
                        RegNo = "N/A" 
                    },
                    Email = s.Email,
                    Phone = s.Phones.FirstOrDefault() != null ? s.Phones.FirstOrDefault().PhoneNumber : "N/A",
                    City = s.Location != null ? s.Location.City : "Unknown",
                    s.Description,
                    s.EstablishedDate,
                    s.FacebookUrl,
                    s.InstagramUrl,
                    s.TwitterUrl,
                    s.WebsiteUrl
                })
                .ToListAsync();

            return Ok(studs);
        }

        // GET: api/stud/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudById(int id)
        {
            var stud = await _context.Studs
                .Include(s => s.Location)
                .Include(s => s.Phones)
                .FirstOrDefaultAsync(s => s.StudId == id);

            if (stud == null) return NotFound();

            return Ok(stud);
        }

        // GET: api/stud/by-name/{name}
        [HttpGet("by-name/{name}")]
        public async Task<IActionResult> GetStudByName(string name)
        {
            var searchName = name.Replace("-", " ");
            var stud = await _context.Studs
                .Include(s => s.Location)
                .Include(s => s.Phones)
                .Include(s => s.Horses)
                .FirstOrDefaultAsync(s => s.NameArabic == searchName || s.NameEnglish == searchName);

            if (stud == null) return NotFound();

            return Ok(stud);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> CreateStud([FromForm] StudCreateRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string? imageUrl = null;

            if (model.ImageFile != null)
            {
                var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "studs");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
                var fileName = Guid.NewGuid() + "_" + model.ImageFile.FileName;
                var path = Path.Combine(folder, fileName);
                using (var stream = new FileStream(path, FileMode.Create)) { await model.ImageFile.CopyToAsync(stream); }
                imageUrl = "/uploads/studs/" + fileName;
            }

            // Handle Location
            int? studLocationId = model.LocationId;
            if (!studLocationId.HasValue && !string.IsNullOrEmpty(model.City))
            {
                var location = await _context.Locations.FirstOrDefaultAsync(l => l.City == model.City);
                if (location == null)
                {
                    location = new Location { City = model.City, Address = model.City, Government = model.City };
                    _context.Locations.Add(location);
                    await _context.SaveChangesAsync();
                }
                studLocationId = location.LocationId;
            }

            var stud = new Stud
            {
                NameArabic = model.NameArabic,
                NameEnglish = model.NameEnglish,
                Description = model.Description,
                Email = model.Email,
                FacebookUrl = model.FacebookUrl,
                InstagramUrl = model.InstagramUrl,
                TwitterUrl = model.TwitterUrl,
                WebsiteUrl = model.WebsiteUrl,
                LocationId = studLocationId,
                ImageUrl = imageUrl,
                StudType = model.StudType,
                EstablishedDate = model.EstablishedDate.HasValue 
                    ? DateTime.SpecifyKind(model.EstablishedDate.Value, DateTimeKind.Utc) 
                    : null
            };

            _context.Studs.Add(stud);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Stud created successfully", studId = stud.StudId });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> UpdateStud(int id, [FromForm] StudCreateRequest model)
        {
            var stud = await _context.Studs.FindAsync(id);
            if (stud == null) return NotFound();

            // Handle Location
            int? studLocationId = model.LocationId;
            if (!studLocationId.HasValue && !string.IsNullOrEmpty(model.City))
            {
                var location = await _context.Locations.FirstOrDefaultAsync(l => l.City == model.City);
                if (location == null)
                {
                    location = new Location { City = model.City, Address = model.City, Government = model.City };
                    _context.Locations.Add(location);
                    await _context.SaveChangesAsync();
                }
                studLocationId = location.LocationId;
            }

            stud.NameArabic = model.NameArabic;
            stud.NameEnglish = model.NameEnglish;
            stud.Description = model.Description;
            stud.Email = model.Email;
            stud.FacebookUrl = model.FacebookUrl;
            stud.InstagramUrl = model.InstagramUrl;
            stud.TwitterUrl = model.TwitterUrl;
            stud.WebsiteUrl = model.WebsiteUrl;
            stud.LocationId = studLocationId;
            stud.StudType = model.StudType;
            stud.EstablishedDate = model.EstablishedDate.HasValue 
                ? DateTime.SpecifyKind(model.EstablishedDate.Value, DateTimeKind.Utc) 
                : null;

            if (model.ImageFile != null)
            {
                var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "studs");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
                var fileName = Guid.NewGuid() + "_" + model.ImageFile.FileName;
                var path = Path.Combine(folder, fileName);
                using (var stream = new FileStream(path, FileMode.Create)) { await model.ImageFile.CopyToAsync(stream); }
                stud.ImageUrl = "/uploads/studs/" + fileName;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Stud updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> DeleteStud(int id)
        {
            var stud = await _context.Studs.FindAsync(id);
            if (stud == null) return NotFound();

            _context.Studs.Remove(stud);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Stud deleted successfully" });
        }
    }
}
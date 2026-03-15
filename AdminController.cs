using ArabianHorseSystem.Data;
using ArabianHorseSystem.DTOs;
using ArabianHorseSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArabianHorseSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;

        public AdminController(UserManager<User> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        private async Task<bool> IsAdmin()
        {
            var admin = await _userManager.GetUserAsync(HttpContext.User);
            return admin != null && admin.Role == "Admin";
        }


        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            if (!await IsAdmin()) return Unauthorized();

            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.PhoneNumber,
                    u.Role,
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser(CreateUserDto dto)
        {
            if (!await IsAdmin()) return Unauthorized();

            var user = new User
            {
                UserName = dto.Email,
                Email = dto.Email,
                FullName = dto.FullName,
                Role = dto.Role,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            if (!await _context.Roles.AnyAsync(r => r.Name == dto.Role))
            {
                await _context.Roles.AddAsync(new IdentityRole<int>(dto.Role));
                await _context.SaveChangesAsync();
            }

            await _userManager.AddToRoleAsync(user, dto.Role);

            return Ok(new { message = "User created successfully" });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!await IsAdmin()) return Unauthorized();

            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null)
                return NotFound("User not found");

            await _userManager.DeleteAsync(user);

            return Ok(new { message = "User deleted successfully" });
        }

        [HttpPut("change-role")]
        public async Task<IActionResult> ChangeRole(ChangeRoleDto dto)
        {
            if (!await IsAdmin()) return Unauthorized();

            var user = await _userManager.FindByIdAsync(dto.UserId.ToString());

            if (user == null)
                return NotFound("User not found");

            var roles = await _userManager.GetRolesAsync(user);

            await _userManager.RemoveFromRolesAsync(user, roles);

            await _userManager.AddToRoleAsync(user, dto.Role);

            user.Role = dto.Role;

            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Role updated successfully" });
        }

    
   
        [HttpPost("horses")]
        public async Task<IActionResult> AddHorse(HorseProfile horse)
        {
            if (!await IsAdmin()) return Unauthorized();

            _context.HorseProfiles.Add(horse);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Horse added successfully" });
        }

        [HttpPut("horses/{microchipId}")]
        public async Task<IActionResult> UpdateHorse(string microchipId, HorseProfile updatedHorse)
        {
            if (!await IsAdmin()) return Unauthorized();

            var horse = await _context.HorseProfiles
                .FirstOrDefaultAsync(h => h.MicrochipId == microchipId);

            if (horse == null)
                return NotFound("Horse not found");

            horse.Name = updatedHorse.Name;
            horse.Age = updatedHorse.Age;
            horse.Gender = updatedHorse.Gender;
            horse.Breed = updatedHorse.Breed;
            horse.ImageUrl = updatedHorse.ImageUrl;
            horse.VideoUrl = updatedHorse.VideoUrl;
            horse.Price = updatedHorse.Price;
            horse.IsForSale = updatedHorse.IsForSale;
            horse.ClaimLocation = updatedHorse.ClaimLocation;
            horse.RacingHistory = updatedHorse.RacingHistory;
            horse.Vaccinated = updatedHorse.Vaccinated;
            horse.Breeder = updatedHorse.Breeder;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Horse updated successfully" });
        }

        [HttpDelete("horses/{microchipId}")]
        public async Task<IActionResult> DeleteHorse(string microchipId)
        {
            if (!await IsAdmin()) return Unauthorized();

            var horse = await _context.HorseProfiles
                .FirstOrDefaultAsync(h => h.MicrochipId == microchipId);

            if (horse == null)
                return NotFound("Horse not found");

            _context.HorseProfiles.Remove(horse);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Horse deleted successfully" });
        }


        [HttpPost("auctions")]
        public async Task<IActionResult> AddAuction(Auction auction)
        {
            if (!await IsAdmin()) return Unauthorized();

            _context.Auctions.Add(auction);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Auction created successfully" });
        }

        [HttpPut("auctions/{id}")]
        public async Task<IActionResult> UpdateAuction(int id, Auction updatedAuction)
        {
            if (!await IsAdmin()) return Unauthorized();

            var auction = await _context.Auctions.FindAsync(id);

            if (auction == null)
                return NotFound("Auction not found");

            auction.Name = updatedAuction.Name;
            auction.StartTime = updatedAuction.StartTime;
            auction.EndTime = updatedAuction.EndTime;
            auction.BasePrice = updatedAuction.BasePrice;
            auction.MinimumIncrement = updatedAuction.MinimumIncrement;
            auction.ImageUrl = updatedAuction.ImageUrl;
            auction.VideoUrl = updatedAuction.VideoUrl;
            auction.Status = updatedAuction.Status;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Auction updated successfully" });
        }

        [HttpDelete("auctions/{id}")]
        public async Task<IActionResult> DeleteAuction(int id)
        {
            if (!await IsAdmin()) return Unauthorized();

            var auction = await _context.Auctions.FindAsync(id);

            if (auction == null)
                return NotFound("Auction not found");

            _context.Auctions.Remove(auction);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Auction deleted successfully" });
        }


        [HttpPost("studs")]
        public async Task<IActionResult> AddStud(Stud stud)
        {
            if (!await IsAdmin()) return Unauthorized();

            _context.Studs.Add(stud);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Stud added successfully" });
        }

        [HttpPut("studs/{id}")]
        public async Task<IActionResult> UpdateStud(int id, Stud updatedStud)
        {
            if (!await IsAdmin()) return Unauthorized();

            var stud = await _context.Studs.FindAsync(id);

            if (stud == null)
                return NotFound("Stud not found");

            stud.NameArabic = updatedStud.NameArabic;
            stud.NameEnglish = updatedStud.NameEnglish;
            stud.Description = updatedStud.Description;
            stud.Email = updatedStud.Email;
            stud.WebsiteUrl = updatedStud.WebsiteUrl;
            stud.ImageUrl = updatedStud.ImageUrl;
            stud.VideoUrl = updatedStud.VideoUrl;
            stud.StallCapacity = updatedStud.StallCapacity;
            stud.BoardingPrice = updatedStud.BoardingPrice;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Stud updated successfully" });
        }

        [HttpDelete("studs/{id}")]
        public async Task<IActionResult> DeleteStud(int id)
        {
            if (!await IsAdmin()) return Unauthorized();

            var stud = await _context.Studs.FindAsync(id);

            if (stud == null)
                return NotFound("Stud not found");

            _context.Studs.Remove(stud);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Stud deleted successfully" });
        }
    }
}
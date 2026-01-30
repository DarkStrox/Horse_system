using ArabianHorseSystem.Data;
using ArabianHorseSystem.DTOs;
using ArabianHorseSystem.Models;
using ArabianHorseSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArabianHorseSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JoinController : ControllerBase
    {
        private readonly NotificationService _notificationService;
        private readonly UserManager<ArabianHorseSystem.Models.User> _userManager;
        private readonly ApplicationDbContext _context;

        public JoinController(NotificationService notificationService, UserManager<ArabianHorseSystem.Models.User> userManager, ApplicationDbContext context)
        {
            _notificationService = notificationService;
            _userManager = userManager;
            _context = context;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] JoinRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _notificationService.AddNotificationAsync(request);
            return Ok(new { message = "Application submitted successfully" });
        }

        [HttpGet("notifications")]
        [Authorize] // Should strictly be Admin only, but checking role inside to be safe or use Policy
        public async Task<IActionResult> GetNotifications()
        {
            // var user = await _userManager.GetUserAsync(User);
            // if (user == null || user.Role != "Admin")
            //    return Unauthorized("Only Admins can view applications.");

            var notifications = await _notificationService.GetAllNotificationsAsync();
            return Ok(notifications);
        }

        [HttpPost("approve/{id}")]
        [Authorize]
        public async Task<IActionResult> Approve(string id)
        {
            var admin = await _userManager.GetUserAsync(HttpContext.User);
            if (admin == null || admin.Role != "Admin")
                return Unauthorized();

            var notification = await _notificationService.GetNotificationAsync(id);
            if (notification == null)
                return NotFound("Application not found.");

            var req = notification.Request;
            var existingUser = await _userManager.FindByEmailAsync(req.Email!);

            // Logic:
            // 1. If user doesn't exist, we can't really 'upgrade' them easily without password. 
            //    Assumption: User MUST be registered first to apply? Or we create a placeholder?
            //    The prompt says: "enter your information inclucing name email phone number... after he approve him his name , email and phone and his ID Card goes to the postgredatabase"
            //    This implies we might need to CREATE the user if they don't exist, OR update if they do.
            //    Generating a random password if creating new user.

            bool isNewUser = false;
            if (existingUser == null)
            {
                isNewUser = true;
                existingUser = new ArabianHorseSystem.Models.User
                {
                    UserName = req.Email,
                    Email = req.Email,
                    FullName = req.FullName,
                    PhoneNumber = req.PhoneNumber,
                    Role = req.Role, // Set role immediately
                    EmailConfirmed = true 
                };
                var result = await _userManager.CreateAsync(existingUser, "Password123!"); // Temporary default password
                if (!result.Succeeded)
                    return BadRequest(result.Errors);
                
                await _userManager.AddToRoleAsync(existingUser, req.Role!);
            }
            else
            {
                // Update existing user role
                existingUser.Role = req.Role;
                await _userManager.UpdateAsync(existingUser);
                
                // Ensure Identity role is also added
                if (!await _userManager.IsInRoleAsync(existingUser, req.Role!))
                {
                    await _userManager.AddToRoleAsync(existingUser, req.Role!);
                }
            }

            // 2. Add to specific role tables
            try
            {
                if (req.Role == "EquineVet")
                {
                    var vet = new EquineVet
                    {
                        VetId = existingUser.Id,
                        Ssn = req.NationalId ?? "N/A",
                        VeterinaryLicense = req.LicenseNumber ?? "N/A"
                    };
                    if (!_context.EquineVets.Any(v => v.VetId == existingUser.Id))
                    {
                        _context.EquineVets.Add(vet);
                    }
                }
                else if (req.Role == "Trainer")
                {
                    var trainer = new Trainer
                    {
                        TrainerId = existingUser.Id,
                        ExperienceYears = req.ExperienceYears ?? 0,
                        Bio = req.Motivation
                    };
                    if (!_context.Trainers.Any(t => t.TrainerId == existingUser.Id))
                    {
                        _context.Trainers.Add(trainer);
                    }
                }
                else if (req.Role == "Seller") // Maps to Owner with intent to sell
                {
                    // Update Role to Seller in DB? Or User.Role = "Seller"?
                    // User.cs role comment says 'Owner', 'Trainer', 'EquineVet', 'Buyer'.
                    // Let's assume 'Seller' is a valid role string we can use.
                    
                    // Create Owner profile if not exists
                    if (!_context.Owners.Any(o => o.OwnerId == existingUser.Id))
                    {
                        var owner = new Owner
                        {
                            OwnerId = existingUser.Id,
                            Since = DateTime.UtcNow
                        };
                        _context.Owners.Add(owner);
                    }
                }

                await _context.SaveChangesAsync();
                
                // 3. Delete notification
                await _notificationService.DeleteNotificationAsync(id);

                return Ok(new { message = "User approved and role updated.", tempPassword = isNewUser ? "Password123!" : null });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating database: {ex.Message}");
            }
        }

        [HttpPost("approve-horse/{id}")]
        [Authorize]
        public async Task<IActionResult> ApproveHorse(string id)
        {
            var admin = await _userManager.GetUserAsync(HttpContext.User);
            if (admin == null || admin.Role != "Admin")
                return Unauthorized();

            var notification = await _notificationService.GetNotificationAsync(id);
            if (notification == null || notification.HorseRequest == null)
                return NotFound("Horse application not found.");

            var req = notification.HorseRequest;
            
            // Find Owner (Sender)
            var senderId = notification.SenderId;
            if (string.IsNullOrEmpty(senderId)) return BadRequest("Invalid sender ID.");
            
            if (!int.TryParse(senderId, out int ownerId)) return BadRequest("Invalid owner ID format.");

            var owner = await _context.Owners.FirstOrDefaultAsync(o => o.OwnerId == ownerId);

            if (owner == null)
            {
                return BadRequest("Owner profile not found for the sender.");
            }

            // Create Horse Profile
            var horse = new HorseProfile
            {
                MicrochipId = req.MicrochipId,
                Name = req.Name,
                Age = req.Age,
                Price = req.Price,
                HealthStatus = req.HealthStatus,
                Vaccinated = req.Vaccinated,
                RacingHistory = req.HasRacingHistory ? req.RacingHistoryDetails : "None",
                ClaimLocation = req.ClaimLocation,
                ImageUrl = req.ImageUrl ?? "/auctions/hero.png", // Default image if none
                IsForSale = true,
                IsApproved = true,
                OwnerId = owner.OwnerId
            };

            _context.HorseProfiles.Add(horse);
            await _context.SaveChangesAsync();

            await _notificationService.DeleteNotificationAsync(id);

            return Ok(new { message = "Horse approved and listed for sale." });
        }

        [HttpPost("deny/{id}")]
        [Authorize]
        public async Task<IActionResult> Deny(string id)
        {
            var admin = await _userManager.GetUserAsync(HttpContext.User);
            if (admin == null || admin.Role != "Admin")
                return Unauthorized();

            await _notificationService.DeleteNotificationAsync(id);
            return Ok(new { message = "Application denied." });
        }
    }
}

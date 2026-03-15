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
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;

        public JoinController(
            NotificationService notificationService,
            UserManager<User> userManager,
            ApplicationDbContext context)
        {
            _notificationService = notificationService;
            _userManager = userManager;
            _context = context;
        }

        // =====================================================
        // DIRECT REGISTRATION
        // =====================================================

        [HttpPost("vet")]
        public async Task<IActionResult> RegisterVet([FromForm] VetJoinRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var licensePath = await SavePdf(request.LicensePdf);
            var idCardPath = await SavePdf(request.IdCardPdf);
            var certificatesPath = await SavePdf(request.CertificatesPdf);

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                Role = "EquineVet"
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var vet = new EquineVet
            {
                VetId = user.Id,
                Ssn = request.NationalId,
                VeterinaryLicense = request.LicenseNumber,

                 LicensePdfUrl = licensePath,
                IdCardPdfUrl = idCardPath,
                CertificatesPdfUrl = certificatesPath
            };

            _context.EquineVets.Add(vet);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Vet registered successfully", licensePath, idCardPath, certificatesPath });
        }
        [HttpGet("vet-documents/{vetId}")]
        [Authorize]
        public async Task<IActionResult> GetVetDocuments(int vetId)
        {
            var admin = await _userManager.GetUserAsync(HttpContext.User);

            if (admin == null || admin.Role != "Admin")
                return Unauthorized();

            var vet = await _context.EquineVets
                .Include(v => v.User)
                .FirstOrDefaultAsync(v => v.VetId == vetId);

            if (vet == null)
                return NotFound();

            return Ok(new
            {
                vet.User.FullName,
                vet.User.Email,
                LicensePdf = vet.LicensePdfUrl,
                IdCardPdf = vet.IdCardPdfUrl,
                CertificatesPdf = vet.CertificatesPdfUrl
            });
        }

        [HttpPost("buyer")]
        public async Task<IActionResult> RegisterBuyer([FromBody] BuyerJoinRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                Role = "Buyer"
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Buyer registered successfully" });
        }
        [HttpGet("buyer/{id}")]
        [Authorize]
        public async Task<IActionResult> GetBuyer(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (user == null || user.Role != "Buyer")
                return NotFound();

            return Ok(new
            {
                user.FullName,
                user.Email,
                user.PhoneNumber
            });
        }

        [HttpPost("seller")]
        public async Task<IActionResult> RegisterSeller([FromForm] SellerJoinRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var idCardPath = await SavePdf(request.IdCardPdf);
            var recommendationPath = await SavePdf(request.RecommendationLetterPdf);

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                PhoneNumber = request.PhoneNumber,
                Role = "Owner"
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var owner = new Owner
            {
                OwnerId = user.Id,
                Since = DateTime.UtcNow,
                IdCardPdfUrl = idCardPath,
                RecommendationLetterUrl = recommendationPath
            };

            _context.Owners.Add(owner);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Seller registered successfully", idCardPath, recommendationPath });
        }

        [HttpGet("seller-documents/{ownerId}")]
        [Authorize]
        public async Task<IActionResult> GetSellerDocuments(int ownerId)
        {
            var admin = await _userManager.GetUserAsync(HttpContext.User);

            if (admin == null || admin.Role != "Admin")
                return Unauthorized();

            var owner = await _context.Owners
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.OwnerId == ownerId);

            if (owner == null)
                return NotFound();

            return Ok(new
            {
                owner.User.FullName,
                owner.User.Email,
                IdCard = owner.IdCardPdfUrl,
                RecommendationLetter = owner.RecommendationLetterUrl
            });
        }

        [HttpPost("user")]
        { 
        public async Task<IActionResult> RegisterUser([FromBody] SimpleUserRegister request)                //simple user will be deleted
            if (!ModelState.IsValid)                                                                        //simple user will be deleted
                return BadRequest(ModelState);                                                              //simple user will be deleted
                                                                                                            //simple user will be deleted
            var user = new User                                                                             //simple user will be deleted
            {                                                                                               //simple user will be deleted
                UserName = request.Email,                                                                   //simple user will be deleted
                Email = request.Email,                                                                      //simple user will be deleted
                FullName = request.FullName,                                                                //simple user will be deleted
                PhoneNumber = request.PhoneNumber,                                                          //simple user will be deleted
                Role = "User"                                                                               //simple user will be deleted
            };                                                                                              //simple user will be deleted
                                                                                                            //simple user will be deleted
            var result = await _userManager.CreateAsync(user, request.Password);                            //simple user will be deleted
                                                                                                            //simple user will be deleted
            if (!result.Succeeded)                                                                          //simple user will be deleted
                return BadRequest(result.Errors);                                                           //simple user will be deleted
                                                                                                            //simple user will be deleted
            return Ok(new { message = "User registered successfully" });                                    //simple user will be deleted
        }

        // =====================================================
        // APPLICATION SYSTEM (ADMIN APPROVAL)
        // =====================================================

        [HttpPost("apply")]
        public async Task<IActionResult> Apply([FromBody] JoinRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _notificationService.AddNotificationAsync(request);

            return Ok(new { message = "Application submitted successfully" });
        }

        [HttpGet("notifications")]
        [Authorize]
        public async Task<IActionResult> GetNotifications()
        {
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

            bool isNewUser = false;

            if (existingUser == null)
            {
                isNewUser = true;

                existingUser = new User
                {
                    UserName = req.Email,
                    Email = req.Email,
                    FullName = req.FullName,
                    PhoneNumber = req.PhoneNumber,
                    Role = req.Role,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(existingUser, "Password123!");

                if (!result.Succeeded)
                    return BadRequest(result.Errors);

                await _userManager.AddToRoleAsync(existingUser, req.Role!);
            }
            else
            {
                existingUser.Role = req.Role;
                await _userManager.UpdateAsync(existingUser);

                if (!await _userManager.IsInRoleAsync(existingUser, req.Role!))
                {
                    await _userManager.AddToRoleAsync(existingUser, req.Role!);
                }
            }

            try
            {
                if (req.Role == "EquineVet")
                {
                    if (!_context.EquineVets.Any(v => v.VetId == existingUser.Id))
                    {
                        var vet = new EquineVet
                        {
                            VetId = existingUser.Id,
                            Ssn = req.NationalId ?? "N/A",
                            VeterinaryLicense = req.LicenseNumber ?? "N/A",
                            ExperienceYears = req.ExperienceYears,
                            Specialization = req.Specialization,
                            PreviousWorkplace = req.PreviousWorkplace,
                            HorseExperience = req.HorseExperience
                        };

                        _context.EquineVets.Add(vet);
                    }
                }

                else if (req.Role == "Trainer")
                {
                    if (!_context.Trainers.Any(t => t.TrainerId == existingUser.Id))
                    {
                        var trainer = new Trainer
                        {
                            TrainerId = existingUser.Id,
                            ExperienceYears = req.ExperienceYears ?? 0,
                            Bio = req.Motivation
                        };

                        _context.Trainers.Add(trainer);
                    }
                }

                else if (req.Role == "Seller")
                {
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

                await _notificationService.DeleteNotificationAsync(id);

                return Ok(new
                {
                    message = "User approved successfully",
                    tempPassword = isNewUser ? "Password123!" : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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
                return NotFound("Horse request not found");

            var req = notification.HorseRequest;

            var senderId = notification.SenderId;

            var owner = await _context.Owners
                .FirstOrDefaultAsync(o => o.OwnerId == senderId);

            if (owner == null)
                return BadRequest("Owner not found");

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
                ImageUrl = req.ImageUrl ?? "/auctions/hero.png",
                IsForSale = true,
                IsApproved = true,
                OwnerId = owner.OwnerId
            };

            _context.HorseProfiles.Add(horse);

            await _context.SaveChangesAsync();

            await _notificationService.DeleteNotificationAsync(id);

            return Ok(new { message = "Horse approved and listed successfully" });
        }

        [HttpPost("deny/{id}")]
        [Authorize]
        public async Task<IActionResult> Deny(string id)
        {
            var admin = await _userManager.GetUserAsync(HttpContext.User);

            if (admin == null || admin.Role != "Admin")
                return Unauthorized();

            await _notificationService.DeleteNotificationAsync(id);

            return Ok(new { message = "Application denied" });
        }

        // =====================================================
        // FILE UPLOAD
        // =====================================================

        private async Task<string> SavePdf(IFormFile file)
        {
            if (file == null)
                return "";

            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/pdfs");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = Guid.NewGuid().ToString() + ".pdf";

            var path = Path.Combine(folder, fileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return "/pdfs/" + fileName;
        }
    }
}
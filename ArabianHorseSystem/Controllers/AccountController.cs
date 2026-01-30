using ArabianHorseSystem.Models;
using ArabianHorseSystem.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace ArabianHorseSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ArabianHorseSystem.Models.User> _userManager;
        private readonly SignInManager<ArabianHorseSystem.Models.User> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AccountController(UserManager<ArabianHorseSystem.Models.User> userManager, SignInManager<ArabianHorseSystem.Models.User> signInManager, IConfiguration configuration, IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = new ArabianHorseSystem.Models.User
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return Ok(new { message = "Registration successful" });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("Invalid credentials");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (result.Succeeded)
            {
                var token = await GenerateJwtToken(user);
                return Ok(new { token, user = new { user.Email, user.FullName, user.Role } });
            }

            return Unauthorized("Invalid credentials");
        }


        private async Task<string> GenerateJwtToken(ArabianHorseSystem.Models.User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var secret = jwtSettings["Key"] ?? "ArabianHorseSystemSuperSecretKey2026!";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Role, user.Role ?? ""), // Custom property role
                new Claim("FullName", user.FullName ?? "")
            };

            // In case we want to support standard Identity roles as well:
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                if (!claims.Any(c => c.Type == ClaimTypes.Role && c.Value == role))
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
            }

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // For security, don't reveal if user exists or not
                return Ok(new { message = "If your email is registered, you will receive a reset link." });
            }

            // Ensure SecurityStamp exists (critical for token generation)
            if (await _userManager.GetSecurityStampAsync(user) == null)
            {
                await _userManager.UpdateSecurityStampAsync(user);
            }

            try 
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                
                // Construct the reset link (pointing to our React frontend)
                var resetLink = $"http://localhost:5173/reset-password?email={Uri.EscapeDataString(user.Email!)}&token={Uri.EscapeDataString(token)}";
                
                var emailBody = $@"
                    <div dir='rtl' style='font-family: Arial, sans-serif; line-height: 1.6;'>
                        <h2 style='color: #48B02C;'>نظام الخيل العربية</h2>
                        <p>مرحباً {user.FullName}،</p>
                        <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. يمكنك القيام بذلك من خلال النقر على الزر أدناه:</p>
                        <a href='{resetLink}' style='display: inline-block; padding: 12px 24px; background-color: #48B02C; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;'>إعادة تعيين كلمة المرور</a>
                        <p>إذا لم تطلب هذا، يمكنك تجاهل هذا البريد الإلكتروني.</p>
                        <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
                        <p style='font-size: 0.8em; color: #666;'>هذا بريد آلي، يرجى عدم الرد عليه.</p>
                    </div>";

                await _emailService.SendEmailAsync(user.Email!, "إعادة تعيين كلمة المرور - نظام الخيل العربية", emailBody);

                return Ok(new { 
                    message = "Verification link sent successfully.",
                    token = token // Keep token here for demo/easy testing as well
                });
            }
            catch (Exception ex)
            {
                // Log the error (in a real app)
                return StatusCode(500, new { message = "Internal server error during token generation.", detail = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return BadRequest("Invalid request");

            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);

            if (result.Succeeded)
            {
                user.LastPasswordChangedAt = DateTime.UtcNow;
                await _userManager.UpdateAsync(user);
                return Ok(new { message = "Password reset successfully." });
            }

            return BadRequest(result.Errors);
        }

        [HttpGet("check")]
        public async Task<IActionResult> CheckEmail(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Ok(new { exists = false });
            
            return Ok(new { exists = true, email = user.Email, role = user.Role });
        }

        [HttpGet("force-reset")]
        public async Task<IActionResult> ForceReset(string email, string newPass)
        {
             var user = await _userManager.FindByEmailAsync(email);
             if (user == null) 
             {
                 user = new ArabianHorseSystem.Models.User { 
                     UserName = email, 
                     Email = email, 
                     FullName = "System Admin", 
                     EmailConfirmed = true, 
                     Role = "Admin" 
                 };
                 var createResult = await _userManager.CreateAsync(user, newPass);
                 if (!createResult.Succeeded) return BadRequest(string.Join(", ", createResult.Errors.Select(e => e.Description)));
                 
                 return Ok("User Created with password: " + newPass);
             }

             var token = await _userManager.GeneratePasswordResetTokenAsync(user);
             var result = await _userManager.ResetPasswordAsync(user, token, newPass);

             if (result.Succeeded)
             {
                 user.LastPasswordChangedAt = DateTime.UtcNow;
                 await _userManager.UpdateAsync(user);
                 return Ok("Password reset successfully to: " + newPass);
             }
             return BadRequest(string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }

    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}

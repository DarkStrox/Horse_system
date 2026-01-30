using ArabianHorseSystem.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace ArabianHorseSystem.Data
{
    public static class DbSeeder
    {
        public static async Task SeedHorsesAsync(ApplicationDbContext context, UserManager<User> userManager)
        {
            // Ensure Admin user exists for ownership
            var adminUser = await userManager.FindByEmailAsync("mohamed200031921@gmail.com");
            if (adminUser == null) return; // Should created by Program.cs already

            // Ensure Owner record exists
            var owner = await context.Owners.FirstOrDefaultAsync(o => o.OwnerId == adminUser.Id);
            if (owner == null)
            {
                owner = new Owner { OwnerId = adminUser.Id };
                context.Owners.Add(owner);
                await context.SaveChangesAsync();
            }

            var horses = new List<HorseProfile>
            {
                new HorseProfile
                {
                    MicrochipId = "H001",
                    Name = "أسطورة الشحانية",
                    Gender = "Male",
                    Breed = "صقلاوي",
                    Age = 6,
                    Price = 1500000,
                    IsForSale = true,
                    IsApproved = true,
                    HealthStatus = "ممتاز",
                    Vaccinated = true,
                    ClaimLocation = "الدوحة، قطر",
                    OwnerId = owner.OwnerId,
                    ImageUrl = "/horses/profile_main.png"
                },
                new HorseProfile
                {
                    MicrochipId = "H002",
                    Name = "وردة الصحراء",
                    Gender = "Female",
                    Breed = "صقلاوي جدراني",
                    Age = 5,
                    Price = null,
                    IsForSale = false,
                    IsApproved = true,
                    HealthStatus = "جيد جدًا",
                    Vaccinated = true,
                    ClaimLocation = "الرياض، السعودية",
                    OwnerId = owner.OwnerId,
                    ImageUrl = "/auctions/card_1.png"
                },
                new HorseProfile
                {
                    MicrochipId = "H003",
                    Name = "فجر العرب",
                    Gender = "Male",
                    Breed = "كحيلان",
                    Age = 4,
                    Price = 850000,
                    IsForSale = true,
                    IsApproved = true,
                    HealthStatus = "ممتاز",
                    Vaccinated = true,
                    ClaimLocation = "الرياض، السعودية",
                    OwnerId = owner.OwnerId,
                    ImageUrl = "/auctions/card_2.png"
                },
                new HorseProfile
                {
                    MicrochipId = "H004",
                    Name = "أميرة الوادي",
                    Gender = "Female",
                    Breed = "عبية الشراك",
                    Age = 2,
                    Price = null,
                    IsForSale = false,
                    IsApproved = true,
                    HealthStatus = "ممتاز",
                    Vaccinated = false,
                    ClaimLocation = "جدة، السعودية",
                    OwnerId = owner.OwnerId,
                    ImageUrl = "/auctions/hero.png"
                }
            };

            foreach (var horse in horses)
            {
                if (!await context.HorseProfiles.AnyAsync(h => h.MicrochipId == horse.MicrochipId))
                {
                    context.HorseProfiles.Add(horse);
                }
            }

            await context.SaveChangesAsync();
        }
    }
}

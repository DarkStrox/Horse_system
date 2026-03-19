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
        public static async Task SeedStudsAsync(ApplicationDbContext context)
        {
            if (await context.Studs.AnyAsync()) return;

            // 1. Create Location
            var location = await context.Locations.FirstOrDefaultAsync(l => l.City == "القاهرة");
            if (location == null)
            {
                location = new Location
                {
                    Government = "القاهرة",
                    City = "القاهرة",
                    Address = "طريق سقارة، الهرم، الجيزة"
                };
                context.Locations.Add(location);
                await context.SaveChangesAsync();
            }

            // 2. Create Stud
            var stud = new Stud
            {
                NameArabic = "مربط العرب",
                NameEnglish = "Arab Stud",
                EstablishedDate = DateTime.SpecifyKind(new DateTime(2010, 1, 1), DateTimeKind.Utc),
                Description = "مربط متخصص في تربية الخيول العربية الأصيلة من أفضل السلالات.",
                Email = "info@arabstud.com",
                FacebookUrl = "https://facebook.com/arabstud",
                InstagramUrl = "https://instagram.com/arabstud",
                WebsiteUrl = "https://arabstud.com",
                LocationId = location.LocationId,
                ImageUrl = "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=500",
                StudType = "مربط خاص",
                NumOfHorses = 20,
                NumOfMales = 8,
                NumOfFemales = 12
            };

            context.Studs.Add(stud);
            await context.SaveChangesAsync();
            
            Console.WriteLine("Seeded initial stud: مربط العرب");
        }
    }
}

using ArabianHorseSystem.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace ArabianHorseSystem.Data
{
    public class ApplicationDbContext : IdentityDbContext<ArabianHorseSystem.Models.User, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Location> Locations { get; set; }
        public DbSet<Colour> Colours { get; set; }
        public DbSet<Owner> Owners { get; set; }
        public DbSet<Trainer> Trainers { get; set; }
        public DbSet<EquineVet> EquineVets { get; set; }
        public DbSet<Stud> Studs { get; set; }
        public DbSet<StudPhone> StudPhones { get; set; }
        public DbSet<Manege> Maneges { get; set; }
        public DbSet<Pedigree> Pedigrees { get; set; }
        public DbSet<HorseProfile> HorseProfiles { get; set; }
        public DbSet<TrainingProgramme> TrainingProgrammes { get; set; }
        public DbSet<HorseTrainingEnrollment> HorseTrainingEnrollments { get; set; }
        public DbSet<HealthRecord> HealthRecords { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<NewsPost> NewsPosts { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Bid> Bids { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Mapping to the existing custom table name "users"
            builder.Entity<ArabianHorseSystem.Models.User>(entity =>
            {
                entity.ToTable("users");
                
                // Primary Key alignment
                entity.Property(e => e.Id).HasColumnName("user_id");
                
                // Manual mapping for user's specific columns
                entity.Property(e => e.FullName).HasColumnName("name");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
                entity.Property(e => e.PhoneNumber).HasColumnName("phone");
                entity.Property(e => e.Role).HasColumnName("role");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");

                // Config 1:1 Relationships
                entity.HasOne(u => u.OwnerProfile)
                      .WithOne(o => o.User)
                      .HasForeignKey<Owner>(o => o.OwnerId);

                entity.HasOne(u => u.TrainerProfile)
                      .WithOne(t => t.User)
                      .HasForeignKey<Trainer>(t => t.TrainerId);

                entity.HasOne(u => u.VetProfile)
                      .WithOne(v => v.User)
                      .HasForeignKey<EquineVet>(v => v.VetId);
            });

            // Owner Configuration
            builder.Entity<Owner>(entity =>
            {
                entity.Property(e => e.Preferences).HasColumnType("jsonb");
            });

            // HorseProfile Configuration
            builder.Entity<HorseProfile>(entity =>
            {
                entity.HasOne(h => h.Owner)
                      .WithMany(o => o.Horses)
                      .HasForeignKey(h => h.OwnerId);

                entity.HasOne(h => h.Stud)
                      .WithMany(s => s.Horses)
                      .HasForeignKey(h => h.StudId);
            });

            // StudPhone Configuration
            builder.Entity<StudPhone>(entity =>
            {
                entity.ToTable("stud_phones");
            });

            // Training Enrollment Configuration
            builder.Entity<HorseTrainingEnrollment>(entity =>
            {
                entity.ToTable("horse_training_enrollments");
                entity.HasOne(e => e.Horse)
                      .WithMany(h => h.Enrollments)
                      .HasForeignKey(e => e.MicrochipId);
                
                entity.HasOne(e => e.Program)
                      .WithMany(p => p.Enrollments)
                      .HasForeignKey(e => e.ProgramId);
            });

            // HealthRecord Configuration
            builder.Entity<HealthRecord>(entity =>
            {
                entity.HasOne(r => r.Horse)
                      .WithMany(h => h.HealthRecords)
                      .HasForeignKey(r => r.MicrochipId);
            });

            // Auction Configuration
            builder.Entity<Auction>(entity =>
            {
                entity.HasOne(a => a.Horse)
                      .WithMany(h => h.Auctions)
                      .HasForeignKey(a => a.MicrochipId);

                entity.HasOne(a => a.CreatedBy)
                      .WithMany()
                      .HasForeignKey(a => a.CreatedById);

                entity.HasOne(a => a.Winner)
                      .WithMany()
                      .HasForeignKey(a => a.WinnerId);
            });

            // Bid Configuration
            builder.Entity<Bid>(entity =>
            {
                entity.HasOne(b => b.Auction)
                      .WithMany(a => a.Bids)
                      .HasForeignKey(b => b.AuctionId)
                      .OnDelete(DeleteBehavior.Cascade); // Delete bids if auction deleted
            });

            // Clean up other Identity tables names
            builder.Entity<IdentityRole<int>>(entity => entity.ToTable("roles"));
            builder.Entity<IdentityUserRole<int>>(entity => entity.ToTable("user_roles"));
            builder.Entity<IdentityUserClaim<int>>(entity => entity.ToTable("user_claims"));
            builder.Entity<IdentityUserLogin<int>>(entity => entity.ToTable("user_logins"));
            builder.Entity<IdentityRoleClaim<int>>(entity => entity.ToTable("role_claims"));
            builder.Entity<IdentityUserToken<int>>(entity => entity.ToTable("user_tokens"));
        }
    }
}

using ArabianHorseSystem.Data;
using ArabianHorseSystem.Models;
using ArabianHorseSystem.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// Increase request size limits (global)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 52428800; // 50MB
});

builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.ValueLengthLimit = 52428800; // 50MB
    options.MultipartBodyLengthLimit = 52428800; // 50MB
});
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddTransient<NotificationService>();
builder.Services.AddHttpClient();
builder.Services.AddHttpClient<NewsService>();
builder.Services.AddHostedService<NewsScraperService>();

// 2. Database Connection (Pulling from appsettings.json)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)
           .UseSnakeCaseNamingConvention()); // Essential for Postgres compatibility

// 3. Identity Configuration
builder.Services.AddIdentity<ArabianHorseSystem.Models.User, IdentityRole<int>>(options => {
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 8;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// 4. JWT Authentication setup
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtSecret = jwtSettings["Key"] ?? "ArabianHorseSystemSuperSecretKey2026!";
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true
    };
});

// 5. CORS setup (Allows React to call the API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader());
});

// 6. Add Swagger (Helps you test your API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 7. Auto-migrate database and Seed Admin on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<ArabianHorseSystem.Models.User>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<int>>>();

        Console.WriteLine("Applying migrations... (Checking connection)");
        
        // Test connection first with a short timeout
        context.Database.SetCommandTimeout(10);
        
        if (context.Database.CanConnect())
        {
            context.Database.Migrate();
            
            // Seed "Admin" role
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole<int>("Admin"));
                Console.WriteLine("Created 'Admin' role.");
            }

            // Assign "Admin" role to specific user
            var adminEmail = "mohamed200031921@gmail.com";
            var user = await userManager.FindByEmailAsync(adminEmail);
            if (user == null)
            {
                user = new ArabianHorseSystem.Models.User { UserName = adminEmail, Email = adminEmail, FullName = "System Admin", EmailConfirmed = true, Role = "Admin" };
                await userManager.CreateAsync(user, "Password123!");
                Console.WriteLine($"Created Admin user: {adminEmail}");
            }
            
            if (!await userManager.IsInRoleAsync(user, "Admin"))
            {
                await userManager.AddToRoleAsync(user, "Admin");
                Console.WriteLine($"Assigned 'Admin' identity role to {adminEmail}");
            }

            if (user.Role != "Admin")
            {
                user.Role = "Admin";
                await userManager.UpdateAsync(user);
                Console.WriteLine($"Updated 'Role' property to 'Admin' for {adminEmail}");
            }

            // Force reset password for main admin
            var adminToken = await userManager.GeneratePasswordResetTokenAsync(user);
            await userManager.ResetPasswordAsync(user, adminToken, "Password123!");
            Console.WriteLine($"Reset password for {adminEmail} to 'Password123!'");

            // Also seed "testadmin@gmail.com" for testing purposes
            var testAdminEmail = "testadmin@gmail.com";
            var testUser = await userManager.FindByEmailAsync(testAdminEmail);
            if (testUser == null)
            {
                testUser = new ArabianHorseSystem.Models.User { UserName = testAdminEmail, Email = testAdminEmail, FullName = "Test Admin", EmailConfirmed = true, Role = "Admin" };
                await userManager.CreateAsync(testUser, "Password123!");
                Console.WriteLine($"Created Test Admin user: {testAdminEmail}");
            }

            if (!await userManager.IsInRoleAsync(testUser, "Admin"))
            {
                await userManager.AddToRoleAsync(testUser, "Admin");
                testUser.Role = "Admin"; 
                await userManager.UpdateAsync(testUser);
                Console.WriteLine($"Assigned 'Admin' role to {testAdminEmail}");
            }
            
            // Force reset password to ensure it is known
            var token = await userManager.GeneratePasswordResetTokenAsync(testUser);
            var result = await userManager.ResetPasswordAsync(testUser, token, "Password123!");
            if (result.Succeeded)
            {
                Console.WriteLine($"Reset password for {testAdminEmail} to 'Password123!'");
            }
            else
            {
                Console.WriteLine($"Failed to reset password: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Seed Horses
            await DbSeeder.SeedHorsesAsync(context, userManager);
            Console.WriteLine("Seeded initial horses.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred while migrating the database: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(); // Access this at http://localhost:5000/swagger
}

app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
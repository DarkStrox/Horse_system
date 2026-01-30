using System.Text.Json;
using ArabianHorseSystem.DTOs;
using ArabianHorseSystem.Models;

namespace ArabianHorseSystem.Services
{
    public class NotificationService
    {
        private readonly string _filePath;

        public NotificationService(IWebHostEnvironment env)
        {
            _filePath = Path.Combine(env.ContentRootPath, "Data", "notifications.json");
        }

        public async Task AddNotificationAsync(JoinRequest request)
        {
            var notifications = await GetAllNotificationsAsync();
            
            var newNotification = new JoinNotification
            {
                Id = Guid.NewGuid().ToString(),
                Type = "JoinRequest",
                Request = request,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            notifications.Add(newNotification);
            await SaveNotificationsAsync(notifications);
        }

        public async Task AddHorseSaleNotificationAsync(HorseSaleRequest req, string senderId)
        {
            var notifications = await GetAllNotificationsAsync();
            
            var newNotification = new JoinNotification
            {
                Id = Guid.NewGuid().ToString(),
                Type = "HorseSale",
                SenderId = senderId,
                HorseRequest = req,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            notifications.Add(newNotification);
            await SaveNotificationsAsync(notifications);
        }

        public async Task<List<JoinNotification>> GetAllNotificationsAsync()
        {
            if (!File.Exists(_filePath))
            {
                return new List<JoinNotification>();
            }

            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<JoinNotification>>(json) ?? new List<JoinNotification>();
        }

        public async Task DeleteNotificationAsync(string id)
        {
            var notifications = await GetAllNotificationsAsync();
            var notificationToRemove = notifications.FirstOrDefault(n => n.Id == id);
            
            if (notificationToRemove != null)
            {
                notifications.Remove(notificationToRemove);
                await SaveNotificationsAsync(notifications);
            }
        }

        public async Task<JoinNotification?> GetNotificationAsync(string id)
        {
            var notifications = await GetAllNotificationsAsync();
            return notifications.FirstOrDefault(n => n.Id == id);
        }

        private async Task SaveNotificationsAsync(List<JoinNotification> notifications)
        {
            var json = JsonSerializer.Serialize(notifications, new JsonSerializerOptions { WriteIndented = true });
            
            // Ensure directory exists
            var directory = Path.GetDirectoryName(_filePath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            await File.WriteAllTextAsync(_filePath, json);
        }
    }

    public class JoinNotification
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = "JoinRequest"; // "JoinRequest" or "HorseSale"
        public string? SenderId { get; set; } // For HorseSale
        
        public JoinRequest? Request { get; set; }
        public HorseSaleRequest? HorseRequest { get; set; }

        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
    }
}

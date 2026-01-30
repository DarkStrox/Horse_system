using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArabianHorseSystem.Data;
using ArabianHorseSystem.Models;
using System.Security.Claims;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace ArabianHorseSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessageController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessageController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/message/send
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] MessageDto messageDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var senderIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(senderIdStr) || !int.TryParse(senderIdStr, out int senderId))
            {
                return Unauthorized();
            }

            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = messageDto.ReceiverId,
                HorseId = messageDto.HorseId,
                Subject = messageDto.Subject,
                Content = messageDto.Content,
                Timestamp = DateTime.UtcNow,
                IsRead = false
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Message sent successfully" });
        }

        // GET: api/message/my-messages
        [HttpGet("my-messages")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyMessages()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
             if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var messages = await _context.Messages
                .Where(m => m.ReceiverId == userId || m.SenderId == userId)
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .OrderByDescending(m => m.Timestamp)
                .Select(m => new
                {
                    m.Id,
                    m.Content,
                    m.Subject,
                    m.Timestamp,
                    m.IsRead,
                    SenderName = m.Sender.FullName,
                    ReceiverName = m.Receiver.FullName,
                    Type = m.SenderId == userId ? "Sent" : "Received",
                    HorseId = m.HorseId
                })
                .ToListAsync();

            return Ok(messages);
        }

        // GET: api/message/unread-count
        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
             var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
             if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId))
            {
                return Unauthorized();
            }

            var count = await _context.Messages
                .CountAsync(m => m.ReceiverId == userId && !m.IsRead);

            return Ok(count);
        }
        
        // POST: api/message/mark-read/{id}
        [HttpPost("mark-read/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
             var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
             if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out int userId)) return Unauthorized();

             var message = await _context.Messages.FindAsync(id);

             if (message == null) return NotFound();
             
             if (message.ReceiverId != userId) return Forbid();

             message.IsRead = true;
             await _context.SaveChangesAsync();
             
             return Ok();
        }
    }

    public class MessageDto
    {
        public int ReceiverId { get; set; }
        public string? HorseId { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}

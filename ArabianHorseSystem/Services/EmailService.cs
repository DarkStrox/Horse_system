using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace ArabianHorseSystem.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"];
            var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "2525");
            var smtpUser = emailSettings["SmtpUser"];
            var smtpPass = emailSettings["SmtpPass"];
            var senderEmail = emailSettings["SenderEmail"];
            var senderName = emailSettings["SenderName"];

            Console.WriteLine($"[EmailService] Attempting to send email to {toEmail} via {smtpServer}:{smtpPort}...");

            try 
            {
                using (var client = new SmtpClient(smtpServer, smtpPort))
                {
                    client.Credentials = new NetworkCredential(smtpUser, smtpPass);
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(senderEmail!, senderName),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true
                    };
                    mailMessage.To.Add(toEmail);

                    await client.SendMailAsync(mailMessage);
                    Console.WriteLine("[EmailService] Email sent successfully according to SmtpClient.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailService] ERROR: Failed to send email. Exception: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"[EmailService] Inner Exception: {ex.InnerException.Message}");
                }
                throw; // Rethrow to let the controller handle it
            }
        }
    }
}

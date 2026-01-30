using Microsoft.AspNetCore.Mvc;

namespace ArabianHorseSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        [HttpGet("page-content")]
        public IActionResult GetPageContent()
        {
            var data = new
            {
                Hero = new
                {
                    Title = "إرث الخيل العربية، بمنظور متجدد.",
                    Description = "منصة شاملة لإدارة وتداول والاحتفاء بأجود سلالات الخيل في العالم. نوفر لك أدوات متطورة لتوثيق السلالات وتسهيل المزادات.",
                    PrimaryBtn = "استكشف السوق",
                    SecondaryBtn = "اعرف المزيد"
                },
                Features = new[] {
                    new { Title = "السوق والمزادات", Icon = "shopping-bag", Description = "آليات تداول حديثة تضمن الشفافية والوصول للمشترين الموثوقين." },
                    new { Title = "مركز الإدارة", Icon = "th-large", Description = "أدوات متكاملة لإدارة سجلات الخيول، المواعيد الطبية، والتدريبات." },
                    new { Title = "قاعدة بيانات النسب", Icon = "search", Description = "تتبع دقيق للسلالات والأنساب عبر الأجيال لضمان نقاء الدم." }
                },
                MainArticle = new
                {
                    Category = "أحدث الأخبار",
                    Title = "فن التحكيم: نظرة داخل حلبة عرض الخيل العربية الحديثة.",
                    Description = "احصل على رؤى من كبار الحكام حول ما يلزم للفوز في البيئة التنافسية اليوم، نغوص في التفاصيل الدقيقة التي تميز الأبطال.",
                    ButtonText = "اقرأ المزيد"
                },
                Cards = new[] {
                    new { Title = "المزادات القادمة، اكتشف فرصتك القادمة", Category = "المزادات", Image = "card-2.png", Url = "/auctions" },
                    new { Title = "تحديد نوع الحصان بالذكاء الاصطناعي", Category = "ذكاء اصطناعي", Image = "determine_horse_type.png", Url = "/classify" }
                }
            };
            return Ok(data);
        }
    }
}

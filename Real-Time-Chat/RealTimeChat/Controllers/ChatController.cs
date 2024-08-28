using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealTimeChat.DB.EF;
using RealTimeChat.DB.EF.Entities;
using RealTimeChat.DTO;

namespace RealTimeChat.Controllers
{
    public class ChatController : Controller
    {
        private readonly ILogger<ChatController> _logger;
        private readonly RealTimeChatDbContext _context;

        public ChatController(ILogger<ChatController> logger, RealTimeChatDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet("Chat/GetLastTenRecords")]
        public async Task<IActionResult> GetLastTenRecords()
        {
            var records = await _context.Messages
                .OrderBy(m => m.CreatedAt)
                .Take(10)
                .Include(m => m.User)
                .Select(m => new
                {
                    userName = m.User.UserName,
                    message = m.MessageText
                })
                .ToListAsync();

            if (!records.Any())
            {
                return NoContent();
            }

            return Ok(records);
        }

        [HttpPost("Chat/AddMessage")]
        public async Task<IActionResult> AddMessage([FromBody] MessageDto messageDto)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserName == messageDto.UserName);

            if (user == null)
            {
                user = new User { UserName = messageDto.UserName };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            var message = new Message
            {
                MessageText = messageDto.Message,
                UserId = user.UserId,
                CreatedAt = DateTime.Now
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new { Success = true });
        }
    }
}

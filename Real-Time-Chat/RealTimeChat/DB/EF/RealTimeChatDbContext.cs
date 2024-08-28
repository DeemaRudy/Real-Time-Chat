using Microsoft.EntityFrameworkCore;
using RealTimeChat.DB.EF.Entities;

namespace RealTimeChat.DB.EF
{
    public class RealTimeChatDbContext : DbContext
    {
        public IConfiguration _config;
        public RealTimeChatDbContext(IConfiguration config)
        {
            _config = config;
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(_config.GetConnectionString("AzureConnection"));
        }
    }
}
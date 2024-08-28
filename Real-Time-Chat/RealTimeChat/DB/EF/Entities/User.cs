namespace RealTimeChat.DB.EF.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}
using Microsoft.AspNetCore.SignalR;

namespace RealTimeChat.Hubs
{
    public class RealTimeChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
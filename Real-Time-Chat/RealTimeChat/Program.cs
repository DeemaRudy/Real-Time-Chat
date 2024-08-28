using Microsoft.EntityFrameworkCore;
using RealTimeChat.DB.EF;
using RealTimeChat.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Configuration.AddJsonFile("azureConnection.json", optional: true, reloadOnChange: true);

builder.Services.AddControllersWithViews();
builder.Services.AddSignalR()
            .AddAzureSignalR();
builder.Services.AddDbContext<RealTimeChatDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("AzureConnection")));

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.MapHub<RealTimeChatHub>("/realTimeChatHub");
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Chat}/{action=Index}/{id?}");
app.Run();

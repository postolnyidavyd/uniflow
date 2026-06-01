using System;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Data;
using Domain.Models;
using DTOs.Validators;
using FluentValidation;
using Hangfire;
using Hangfire.PostgreSql;
using Hubs.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Services.Auth;
using Services.Calendar;
using Services.Event;
using Services.ICalBuilder;
using Services.Markdown;
using Services.Photo;
using Services.Queue;
using Services.Settings;
using Services.Subject;
using Services.Subscription;
using Services.Wallet;
using Services.WeightStrategyFactory;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;
using uniflow_backend.Middleware;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Логіка для роботи з Connection String (підтримка формату Railway postgres://)
string GetConnectionString()
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    if (string.IsNullOrEmpty(connectionString) && !string.IsNullOrEmpty(databaseUrl))
    {
        // Парсимо формат postgres://user:pass@host:port/db
        var databaseUri = new Uri(databaseUrl);
        var userInfo = databaseUri.UserInfo.Split(':');

        connectionString = $"Host={databaseUri.Host};" +
                           $"Port={databaseUri.Port};" +
                           $"Database={databaseUri.AbsolutePath.Trim('/')};" +
                           $"Username={userInfo[0]};" +
                           $"Password={userInfo[1]};" +
                           $"SSL Mode=Require;Trust Server Certificate=true;";
    }

    return connectionString ?? throw new InvalidOperationException("Connection string not found.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(GetConnectionString());
});

builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequiredLength = 6;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) &&
                path.StartsWithSegments("/hubs/queue"))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };
});
builder.Services.AddAuthorization();
builder.Services.AddHangfire(config =>
    config.UsePostgreSqlStorage(options =>
    {
        options.UseNpgsqlConnection(GetConnectionString());
    })
);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddHangfireServer();

builder.Services.AddOpenApi();

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterDtoValidator>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IWalletService, WalletService>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<ISubjectService, SubjectService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IWeightStrategyFactory, WeightStrategyFactory>();
builder.Services.AddScoped<IQueueService, QueueService>();
builder.Services.AddScoped<ICalendarService, CalendarService>();
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<IICalbuilder, ICalBuilder>();
builder.Services.AddScoped<IMarkdownParser, MarkdownParser>();

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

builder.Services.AddSignalR()
    .AddJsonProtocol(options => {
        options.PayloadSerializerOptions.Converters
            .Add(new JsonStringEnumConverter());
    });

builder.Services.AddCors(options =>
{
    var frontendUrl = builder.Configuration["FrontendUrl"] ?? "http://localhost:5173";
    options.AddPolicy("AllowFrontend", policyBuilder =>
        policyBuilder.WithOrigins(frontendUrl.Split(','))
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

    string[] roles = ["Student", "Headman"];

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole<Guid>(role));
    }
}

app.UseHttpsRedirection();         
app.UseCors("AllowFrontend");      
app.UseMiddleware<ExceptionMiddleware>(); 
app.UseHangfireDashboard("/hangfire");
app.UseAuthentication();           
app.UseAuthorization();            
app.MapHub<QueueHub>("/hubs/queue");
app.MapControllers();

RecurringJob.AddOrUpdate<IWalletService>(
    "weekly-token-charge",
    service => service.WeeklyTokenChargeAsync(),
    Cron.Weekly(DayOfWeek.Sunday, 9)
);

app.Run();
using System.Text;
using DataAccess.Data;
using Domain.Models;
using DTOs.Validators;
using FluentValidation;
using Hangfire;
using Hangfire.PostgreSql;
using Hubs.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using Services.Auth;
using Services.Calendar;
using Services.Event;
using Services.ICalBuilder;
using Services.Photo;
using Services.Queue;
using Services.Settings;
using Services.Subject;
using Services.Subscription;
using Services.Wallet;
using Services.WeightStrategyFactory;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;
using uniflow_backend.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
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
        options.UseNpgsqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    })
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policyBuilder =>
        policyBuilder.WithOrigins("http://localhost:3000", "http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
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
builder.Services.AddSignalR();

builder.Services.AddControllers();

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));

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

app.UseHangfireDashboard("/hangfire");
app.UseMiddleware<ExceptionMiddleware>();

app.MapHub<QueueHub>("/hubs/queue");

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// Configure the HTTP request pipeline.
app.UseHttpsRedirection();


app.Run();
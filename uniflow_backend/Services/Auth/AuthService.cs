using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using DataAccess.Data;
using Domain.Constants;
using Domain.Models;
using DTOs.AuthDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Services.Wallet;
using Microsoft.IdentityModel.Tokens;
using Services.Subscription;

namespace Services.Auth;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;
    private readonly IWalletService _walletService;
    private readonly ISubscriptionService _subscriptionService;
    private readonly AppDbContext _appDbContext;

    public AuthService(UserManager<User> userManager, IConfiguration configuration, IWalletService walletService,
        ISubscriptionService subscriptionService, AppDbContext appDbContext)
    {
        _userManager = userManager;
        _configuration = configuration;
        _walletService = walletService;
        _subscriptionService = subscriptionService;
        _appDbContext = appDbContext;
    }
    
    public async Task<(AuthResponseDto authResponse, string refreshToken)> RegisterAsync(RegisterDto dto, string ipAddress, string userAgent)
    {
        string role = dto.InviteCode != null && dto.InviteCode == _configuration["HeadmanInviteCode"]
            ? Roles.Headman
            : Roles.Student;
        var user = new User
        {
            Email = dto.Email,
            UserName = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Group = dto.Group
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            throw new ArgumentException(string.Join(", ", result.Errors.Select(e => e.Description)));

        await _userManager.AddToRoleAsync(user, role);
        await _walletService.CreateWalletAsync(user.Id);
        await _subscriptionService.CreateUserCalendarSettings(user.Id);
        
        var authResponse =  GenerateToken(user, role);
        var refreshToken = await CreateSessionAsync(user.Id, ipAddress, userAgent);
        
        return (authResponse, refreshToken);
    }

    public async Task<(AuthResponseDto authResponse, string refreshToken)> LoginAsync(LoginDto dto, string ipAddress, string userAgent)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            throw new ArgumentException("Невірна пошта або пароль");

        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
            throw new ArgumentException("Невірна пошта або пароль");

        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? Roles.Student;

        var authResponse =  GenerateToken(user, role);
        var refreshToken = await CreateSessionAsync(user.Id, ipAddress, userAgent);
        
        return (authResponse, refreshToken);
    }

    public async Task<(AuthResponseDto authResponse, string newRefreshToken)> RefreshTokensAsync(
        string incomingRefreshToken, string ipAddress, string userAgent)
    {
        var session = await _appDbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == incomingRefreshToken || rt.PreviousToken == incomingRefreshToken);
        
        if (session == null)
            throw new UnauthorizedAccessException("Сесію не знайдено.");
        
        //Захист від крадіжки рефреш токена
        if (session.PreviousToken == incomingRefreshToken)
        {
            session.RevokedAt = DateTime.UtcNow;
            await _appDbContext.SaveChangesAsync();
            throw new UnauthorizedAccessException("Виявлено спробу крадіжки сесії. Доступ заблоковано.");
        }
        
        if(!session.IsActive)
            throw new UnauthorizedAccessException("Сесія закінчилась або була відкликана.");
        
        //Замість створення нової і засмічення бд 1000 рефреш токенами оновлюємо наявний
        session.PreviousToken = session.Token;
        session.Token = GenerateRefreshTokenString();
        session.ExpiresAt = DateTime.UtcNow.AddDays(30);
        session.IpAddress = ipAddress;
        session.DeviceInfo = userAgent;
        
        await _appDbContext.SaveChangesAsync();

        var user = await _userManager.FindByIdAsync(session.UserId.ToString());
        var role = (await _userManager.GetRolesAsync(user!)).FirstOrDefault() ?? Roles.Student;

        return (GenerateToken(user!, role), session.Token);
    }

    public async Task RevokeTokenAsync(string refreshToken)
    {
        await _appDbContext.RefreshTokens
            .Where(rt => rt.Token == refreshToken)
            .ExecuteUpdateAsync(s => s.SetProperty(rt => rt.RevokedAt, DateTime.UtcNow));
    }
    
    private AuthResponseDto GenerateToken(User user, string role)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Role, role),
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var expires = DateTime.UtcNow.AddMinutes(15);
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );
        return new AuthResponseDto()
        {
            AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAt = expires
        };
    }
    
    
    private async Task<string> CreateSessionAsync(Guid userId, string ipAddress, string userAgent)
    {
        var refreshToken = new RefreshToken
        {
            UserId = userId,
            Token = GenerateRefreshTokenString(),
            ExpiresAt = DateTime.UtcNow.AddDays(30),
            Created = DateTime.UtcNow,
            IpAddress = ipAddress,
            DeviceInfo = userAgent
        };

        _appDbContext.RefreshTokens.Add(refreshToken);
        await _appDbContext.SaveChangesAsync();

        return refreshToken.Token;
    }

    private static string GenerateRefreshTokenString()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(32);
        var token = Convert.ToHexString(randomBytes).ToLower();

        return token;
    }
}
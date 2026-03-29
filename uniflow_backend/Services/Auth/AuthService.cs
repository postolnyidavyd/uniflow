using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Constants;
using Domain.Models;
using DTOs.AuthDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Services.Wallet;
using Microsoft.IdentityModel.Tokens;

namespace Services.Auth;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;
    private readonly IWalletService _walletService;

    public AuthService(UserManager<User> userManager, IConfiguration configuration, IWalletService walletService)
    {
        _userManager = userManager;
        _configuration = configuration;
        _walletService = walletService;
    }

    public async Task<AuthResponseDto> Register(RegisterDto dto)
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
        await _walletService.CreateWallet(user.Id);
        return GenerateToken(user, role);
    }


    public async Task<AuthResponseDto> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            throw new ArgumentException("Невірна пошта або пароль");
        
        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
            throw new ArgumentException ("Невірна пошта або пароль");

        var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault() ?? Roles.Student;

        return GenerateToken(user, role);
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
        var expires = DateTime.UtcNow.AddDays(7);
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
}
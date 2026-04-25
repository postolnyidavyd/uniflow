using DTOs.AuthDTOs;
using Microsoft.AspNetCore.Mvc;
using Services.Auth;

namespace uniflow_backend.Controllers;
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {   
        var (authResponse, refreshToken) = await _authService.RegisterAsync(dto, GetIpAddress(), GetUserAgent());
        SetTokenCookie(refreshToken);
        
        return Ok(authResponse);
    } 
    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var (authResponse, refreshToken) = await _authService.LoginAsync(dto, GetIpAddress(), GetUserAgent());
        SetTokenCookie(refreshToken);

        return Ok(authResponse);
    }
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh()
    {
        var oldRefreshToken = Request.Cookies["refreshToken"];
        
        if (string.IsNullOrEmpty(oldRefreshToken))
            return Unauthorized(new { message = "Відсутній токен оновлення" });

        try
        {
            var (authResponse, newRefreshToken) =
                await _authService.RefreshTokensAsync(oldRefreshToken, GetIpAddress(), GetUserAgent());
            SetTokenCookie(newRefreshToken); // Оновлюємо куку новим токеном

            return Ok(authResponse);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        
        if (!string.IsNullOrEmpty(refreshToken))
        {
            await _authService.RevokeTokenAsync(refreshToken);
        }

        // Видаляємо з браузера
        Response.Cookies.Delete("refreshToken");
        
        return Ok(new { message = "Успішний вихід" });
    }
    private void SetTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true, 
            Secure = true, // TODO Впевнетися що працюватиме на локальному хості
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(30)
        };
        Response.Cookies.Append("refreshToken", token, cookieOptions);
    }

    private string GetIpAddress()
    {
        if (Request.Headers.ContainsKey("X-Forwarded-For"))
            return Request.Headers["X-Forwarded-For"].ToString();
            
        return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString() ?? "Unknown";
    }

    private string GetUserAgent()
    {
        return Request.Headers["User-Agent"].ToString();
    }
    
}
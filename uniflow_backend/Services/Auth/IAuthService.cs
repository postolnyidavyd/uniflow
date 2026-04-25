using DTOs.AuthDTOs;

namespace Services.Auth;

public interface IAuthService
{
    Task<(AuthResponseDto authResponse, string refreshToken)> RegisterAsync(RegisterDto dto, string ipAddress, string userAgent);
    Task<(AuthResponseDto authResponse, string refreshToken)> LoginAsync(LoginDto dto, string ipAddress, string userAgent);
    
    Task<(AuthResponseDto authResponse, string newRefreshToken)> RefreshTokensAsync(string incomingRefreshToken, string ipAddress, string userAgent);
    Task RevokeTokenAsync(string refreshToken);
}
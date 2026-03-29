using DTOs.AuthDTOs;

namespace Services.Auth;

public interface IAuthService
{
    Task<AuthResponseDto> Register(RegisterDto dto);
    Task<AuthResponseDto> Login(LoginDto dto);
}
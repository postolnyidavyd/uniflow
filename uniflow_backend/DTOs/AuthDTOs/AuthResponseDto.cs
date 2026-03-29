namespace DTOs.AuthDTOs;

public class AuthResponseDto
{
    public string AccessToken { get; set; }
    public DateTime ExpiresAt { get; set; }
}
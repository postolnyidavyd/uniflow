namespace Domain.Models;

public class RefreshToken
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    public required string Token { get; set; }
    public string? PreviousToken { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime Created { get; set; }

    public DateTime? RevokedAt { get; set; }
    
    public string? DeviceInfo { get; set; }
    public string? IpAddress { get; set; }
    
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => RevokedAt == null && !IsExpired;
}
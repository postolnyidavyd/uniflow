namespace Domain.Models;

public class TokenTransaction
{
    public Guid Id {get;set;}
    public int Amount { get; set; } // -1,+1 і тд
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid StudentWalletId { get; set; }
    public StudentWallet StudentWallet { get; set; }
}
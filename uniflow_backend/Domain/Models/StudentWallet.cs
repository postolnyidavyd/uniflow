namespace Domain.Models;

public class StudentWallet
{
    public Guid Id {get; set; }
    public int Balance { get; set; } = 3;


    public Guid UserId { get; set; }
    public User User { get; set; }

    public ICollection<TokenTransaction> TokenTransactions { get; set; } = new List<TokenTransaction>();
}
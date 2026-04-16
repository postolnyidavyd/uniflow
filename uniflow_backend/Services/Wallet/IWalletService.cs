namespace Services.Wallet;

public interface IWalletService
{
    Task CreateWalletAsync(Guid userId);
    Task<int> GetBalanceAsync(Guid userId);
    Task ChargeTokensAsync(Guid userId, int amount, string? reason);
    Task SpendTokensAsync(Guid userId, int amount, string? reason);
    
    Task ChargeTokensBulkAsync(IEnumerable<Guid> userIds, int amount, string? reason)
}
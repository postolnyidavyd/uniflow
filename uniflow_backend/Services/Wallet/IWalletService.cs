namespace Services.Wallet;

public interface IWalletService
{
    Task CreateWallet(Guid userId);
    Task<int> GetBalance(Guid userId);
    Task ChargeTokens(Guid userId, int amount, string reason);
    Task SpendTokens(Guid userId, int amount, string reason);
}
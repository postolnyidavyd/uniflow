namespace Services.Wallet;

public class WalletService : IWalletService
{
    public Task CreateWallet(Guid userId)
    {
        throw new NotImplementedException();
    }

    public Task<int> GetBalance(Guid userId)
    {
        throw new NotImplementedException();
    }

    public Task ChargeTokens(Guid userId, int amount, string reason)
    {
        throw new NotImplementedException();
    }

    public Task SpendTokens(Guid userId, int amount, string reason)
    {
        throw new NotImplementedException();
    }
}
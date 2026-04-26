using DataAccess.Data;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Services.Wallet;

public class WalletService : IWalletService
{
    private readonly AppDbContext _appDbContext;

    public WalletService(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task CreateWalletAsync(Guid userId)
    {
        var wallet = new StudentWallet() { UserId = userId };

        await _appDbContext.StudentWallets.AddAsync(wallet);

        await _appDbContext.SaveChangesAsync();
    }

    public async Task<int> GetBalanceAsync(Guid userId)
    {
        var wallet = await _appDbContext.StudentWallets.FirstOrDefaultAsync(sw => sw.UserId == userId);
        if (wallet == null)
            throw new KeyNotFoundException("Гаманець не знайдено");
        return wallet.Balance;
    }

    public async Task ChargeTokensAsync(Guid userId, int amount, string? reason)
    {
        await using var transaction = await _appDbContext.Database.BeginTransactionAsync();
        try
        {
            var wallet = await _appDbContext.StudentWallets
                .FirstOrDefaultAsync(sw => sw.UserId == userId);
            if (wallet == null)
                throw new KeyNotFoundException("Гаманець не знайдено");

            wallet.Balance += amount;

            var tokenTransaction = new TokenTransaction()
                { Amount = amount, Description = reason, StudentWalletId = wallet.Id };
            await _appDbContext.TokenTransactions.AddAsync(tokenTransaction);

            await _appDbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task SpendTokensAsync(Guid userId, int amount, string? reason)
    {
        await using var transaction = await _appDbContext.Database.BeginTransactionAsync();
        try
        {
            var wallet = await _appDbContext.StudentWallets
                .FirstOrDefaultAsync(sw => sw.UserId == userId);
            if (wallet == null)
                throw new KeyNotFoundException("Гаманець не знайдено");
            if (wallet.Balance < amount)
                throw new ArgumentException("Недостатньо токенів");

            wallet.Balance -= amount;

            var tokenTransaction = new TokenTransaction()
                { Amount = -amount, Description = reason, StudentWalletId = wallet.Id };
            await _appDbContext.TokenTransactions.AddAsync(tokenTransaction);

            await _appDbContext.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task ChargeTokensBulkAsync(IEnumerable<Guid> userIds, int amount, string? reason)
    {
        await _appDbContext.StudentWallets
            .Where(w => userIds.Contains(w.UserId))
            .ExecuteUpdateAsync(s => s.SetProperty(w => w.Balance, w => w.Balance + amount));


        var userWallets = await _appDbContext.StudentWallets
            .Where(w => userIds.Contains(w.UserId))
            .Select(w => new { w.UserId, WalletId = w.Id })
            .ToListAsync();

        var transactionsRecords = userWallets.Select(w => new TokenTransaction()
        {
            Amount = amount,
            Description = reason,
            StudentWalletId = w.WalletId,
        });


        await _appDbContext.TokenTransactions.AddRangeAsync(transactionsRecords);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task WeeklyTokenChargeAsync()
    {
        var userIds = await _appDbContext.StudentWallets
            .Select(w => w.UserId)
            .ToListAsync();
        await ChargeTokensBulkAsync(userIds, 3, "Щотижневе нарахування");
    }

    // public async Task RecalculateBalance(Guid userId)
    // {
    //     var wallet = await _appDbContext.StudentWallets.FirstOrDefaultAsync(sw => sw.UserId == userId);
    //     if(wallet == null)
    //         throw new ArgumentException("Не існує користувача з таким id");
    //     
    //     var tokenAmount = await _appDbContext.TokenTransactions.Where(tt => tt.StudentWalletId == wallet.Id)
    //         .SumAsync(tt => tt.Amount);
    //     if (tokenAmount < 0)
    //         tokenAmount = 0;
    //     wallet.Balance = tokenAmount;
    //     await _appDbContext.SaveChangesAsync();
    // }
}
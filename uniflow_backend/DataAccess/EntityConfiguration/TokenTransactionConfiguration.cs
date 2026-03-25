using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Logging.Abstractions;

namespace DataAccess.EntityConfiguration;

public class TokenTransactionConfiguration : IEntityTypeConfiguration<TokenTransaction>
{
    public void Configure(EntityTypeBuilder<TokenTransaction> builder)
    {
        builder.HasKey(tt => tt.Id);
        builder.HasOne(tt => tt.StudentWallet).WithMany(sw => sw.TokenTransactions)
            .HasForeignKey(tt => tt.StudentWalletId);
    }
}
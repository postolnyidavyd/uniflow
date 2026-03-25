using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfiguration;

public class StudentWalletConfiguration : IEntityTypeConfiguration<StudentWallet>
{
    public void Configure(EntityTypeBuilder<StudentWallet> builder)
    {
        builder.HasKey(sw => sw.Id);
        builder.HasOne(sw => sw.User).WithOne(u => u.StudentWallet)
            .HasForeignKey<StudentWallet>(sw => sw.UserId);
    }
}
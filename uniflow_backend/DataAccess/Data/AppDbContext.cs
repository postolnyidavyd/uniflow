using DataAccess.EntityConfiguration;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Data;

public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<StudentWallet> StudentWallets { get; set; }
    public DbSet<TokenTransaction> TokenTransactions { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<QueueSession> QueueSessions { get; set; }
    public DbSet<QueueEntry> QueueEntries { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfiguration(new StudentWalletConfiguration());
        builder.ApplyConfiguration(new TokenTransactionConfiguration());
        builder.ApplyConfiguration(new EventConfiguration());
        builder.ApplyConfiguration(new SubjectConfiguration());
        builder.ApplyConfiguration(new QueueSessionConfiguration());
        builder.ApplyConfiguration(new QueueEntryConfiguration());
    }
}
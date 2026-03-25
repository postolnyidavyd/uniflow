using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfiguration;

public class QueueEntryConfiguration : IEntityTypeConfiguration<QueueEntry>
{
    public void Configure(EntityTypeBuilder<QueueEntry> builder)
    {
        builder.HasKey(qn => qn.Id);
        builder.HasOne(qn => qn.QueueSession).WithMany(qs => qs.QueueEntries)
            .HasForeignKey(qn => qn.QueueSessionId);
        builder.HasOne(qn => qn.User).WithMany(u => u.QueueEntries).HasForeignKey(qn=>qn.UserId);
    }
}
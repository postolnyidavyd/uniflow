using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfiguration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasMany(u => u.SubjectSubscriptions)
            .WithMany(s => s.Subscribers)
            .UsingEntity(j => j.ToTable("UserSubjectSubscriptions"));

        builder.HasMany(u => u.EventSubscriptions)
            .WithMany(e => e.Subscribers)
            .UsingEntity(j => j.ToTable("UserEventSubscriptions"));

        builder.HasMany(u => u.QueueSubscriptions)
            .WithMany(q => q.Subscribers)
            .UsingEntity(j => j.ToTable("UserQueueSubscriptions"));
    }
}
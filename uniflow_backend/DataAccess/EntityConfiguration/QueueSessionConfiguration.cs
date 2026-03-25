    using Domain.Models;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    namespace DataAccess.EntityConfiguration;

    public class QueueSessionConfiguration : IEntityTypeConfiguration<QueueSession>
    {
        public void Configure(EntityTypeBuilder<QueueSession> builder)
        {
            builder.HasKey(qs => qs.Id);
            builder.HasOne(qs => qs.Subject).WithMany(s => s.QueueSessions).HasForeignKey(qs => qs.SubjectId);
            builder.HasOne(qs => qs.CreatedByUser).WithMany().HasForeignKey(qs => qs.CreatedByUserId);
        }
    }
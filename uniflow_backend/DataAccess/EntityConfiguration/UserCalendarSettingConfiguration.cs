using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DataAccess.EntityConfiguration;

public class UserCalendarSettingConfiguration : IEntityTypeConfiguration<UserCalendarSettings>
{
    public void Configure(EntityTypeBuilder<UserCalendarSettings> builder)
    {
        builder.HasKey(ucs => ucs.Id);
        builder.HasOne(ucs => ucs.User).WithOne(u => u.UserCalendarSettings)
            .HasForeignKey<UserCalendarSettings>(ucs => ucs.UserId);
    }
}
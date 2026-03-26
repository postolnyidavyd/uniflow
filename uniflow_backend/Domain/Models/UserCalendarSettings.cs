namespace Domain.Models;

public class UserCalendarSettings
{
    public Guid Id {get;set; }

    public bool AutoAddAllEvents { get; set; }
    public bool AutoAddUserQueueEvents { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }
}
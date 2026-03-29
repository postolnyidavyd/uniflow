using Microsoft.AspNetCore.Identity;

namespace Domain.Models;

public class User : IdentityUser<Guid>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Group { get; set; }

    public StudentWallet? StudentWallet { get; set; }

    public ICollection<QueueEntry> QueueEntries { get; set; } = new List<QueueEntry>();
    // Можливо буде навігаційна властивість
    //public required string CalendarToken { get; set; }
    
    public UserCalendarSettings? UserCalendarSettings { get; set; }
    
    public ICollection<Subject> SubjectSubscriptions { get; set; } = new List<Subject>();
    public ICollection<Event> EventSubscriptions  { get; set; } = new List<Event>();
    public ICollection<QueueSession> QueueSubscriptions { get; set; } = new List<QueueSession>();
}
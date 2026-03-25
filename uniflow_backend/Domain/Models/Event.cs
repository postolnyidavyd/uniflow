using Domain.Enums;

namespace Domain.Models;

public class Event
{
    public Guid Id { get; set; }

    public required string Title { get; set; }
    public required string ShortTitle { get; set; }
    public string? Description { get; set; }


    public DateTime Date { get; set; }
    public EventType EventType { get; set; }
    public EventFormat EventFormat { get; set; }

    // Залежить від EventFormat
    public string? Location { get; set; } // якщо офлайн
    public string? MeetUrl { get; set; } // якщо онлайн
    
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; }

    public Guid CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
}
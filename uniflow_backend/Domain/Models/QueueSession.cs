using Domain.Enums;

namespace Domain.Models;

public class QueueSession
{
    public Guid Id { get; set; }
    
    public required string Title { get; set; }
    public required string ShortTitle { get; set; }

    public EventFormat EventFormat { get; set; }
    // Залежить від EventFormat
    public string? Location { get; set; } // якщо офлайн
    public string? MeetUrl { get; set; } // якщо онлайн
    
    public DateTime RegistrationStartTime { get; set; }
    public DateTime QueueStartTime { get; set; }
    
    public TimeSpan Duration { get; set; }
    
    public int AverageMinutesPerStudent { get; set; }
    public QueueStatus QueueStatus { get; set; } 

    public bool IsAllowedToSubmitMoreThanOne { get; set; }
    public SubmissionMode? SubmissionMode { get; set; }

    public Guid SubjectId { get; set; }
    public Subject? Subject { get; set; }
    
    public ICollection<QueueEntry> QueueEntries { get; set; } = new List<QueueEntry>();
    
    public Guid CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
    
    public ICollection<User> Subscribers { get; set; } = new List<User>();

    public void Open() => QueueStatus = QueueStatus.Active;
    public void Close() => QueueStatus = QueueStatus.Closed;
    public void Cancel() => QueueStatus = QueueStatus.Cancelled;
    public bool IsAcceptingEntries() => QueueStatus == QueueStatus.Registration || QueueStatus == QueueStatus.Active;
}
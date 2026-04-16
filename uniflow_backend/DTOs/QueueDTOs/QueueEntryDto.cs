using Domain.Enums;

namespace DTOs.QueueDTOs;

public class QueueEntryDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    
    public required string Username { get; set; }
    
    public EntryType? EntryType { get; set; }
    public int Weight { get; set; }
    public bool UsedToken { get; set; }

    public QueueEntryStatus EntryStatus { get; set; }
    public DateTime JoinedAt { get; set; }
    
}
using Domain.Enums;

namespace DTOs.QueueDTOs;

public class QueueSessionShortResponseDto
{
    public Guid Id { get; set; }
    public required string ShortTitle { get; set; }
    public QueueStatus QueueStatus { get; set; }
    public DateTime QueueStartTime { get; set; }
    
    public int EntriesCount { get; set; }

    public int? UserPosition { get; set; }
    
    // public Guid SubjectId { get; set; }
    public required string SubjectName { get; set; }
}
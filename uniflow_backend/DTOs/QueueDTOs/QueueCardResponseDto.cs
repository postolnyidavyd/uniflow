using Domain.Enums;

namespace DTOs.QueueDTOs;

public class QueueCardResponseDto 
{
    public Guid Id { get; set; }
    public required string ShortTitle { get; set; }
    public required string SubjectName { get; set; }
    
    public QueueStatus QueueStatus { get; set; }
    
    public DateTime QueueStartTime { get; set; }
    public DateTime RegistrationStartTime { get; set; }
    
    public string? Location { get; set; } 
    public string? MeetUrl { get; set; } 
    
    public int EntriesCount { get; set; }
    public int GuaranteedSlots { get; set; } 
    
    public bool IsUserJoined { get; set; } 
    public string? CurrentStudentName { get; set; }
}
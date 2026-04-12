using Domain.Enums;

namespace DTOs.EventDTOs;

public class EventDetailResponseDto : EventShortResponseDto
{
    public required string Title { get; set; }
    public string? Description { get; set; }

    public EventFormat EventFormat { get; set; }
    
    public string? Location { get; set; } // якщо офлайн
    public string? MeetUrl { get; set; } 
    
    public Guid SubjectId { get; set; }

    
}
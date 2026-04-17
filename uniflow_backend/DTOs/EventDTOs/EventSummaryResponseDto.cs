using Domain.Enums;

namespace DTOs.EventDTOs;

public class EventSummaryResponseDto
{
    public Guid Id { get; set; }
    public required string ShortTitle { get; set; }
    public required string SubjectName { get; set; }
    
    public DateTime Date { get; set; }
    public EventType EventType { get; set; }
    
    public string? Location { get; set; }
    public string? MeetUrl { get; set; }
    
    public bool IsSubscribed { get; set; }
}
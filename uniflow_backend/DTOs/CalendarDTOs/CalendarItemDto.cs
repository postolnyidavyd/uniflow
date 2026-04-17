namespace DTOs.CalendarDTOs;

public class CalendarItemDto
{
    public Guid Id { get; set; }
    
    public required string ItemShortTitle { get; set; }
    public required string SubjectShortName { get; set; }

    public DateTime StartTime { get; set; }
    
    public string? Location { get; set; }
    public string? MeetUrl { get; set; }
    
    public bool IsSubscribed { get; set; }
    
    public CalendarItemType CalendarItemType { get; set; }
}
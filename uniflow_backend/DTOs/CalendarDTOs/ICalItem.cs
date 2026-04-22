using DTOs.CalendarDTOs;

namespace DTOs.CalendarDTOs;

public class ICalItem
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    
    public string? Location { get; set; }
    public string? Url { get; set; }
    
    public ICalItemType ItemType {get;set;}
    
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    
}
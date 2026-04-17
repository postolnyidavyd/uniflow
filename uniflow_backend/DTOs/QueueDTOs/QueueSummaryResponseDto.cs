namespace DTOs.QueueDTOs;

public class QueueSummaryResponseDto
{
    public Guid Id { get; set; }
    
    public required string ShortTitle { get; set; }
    public required string SubjectName { get; set; }
    
    public DateTime QueueStartTime { get; set; }
    
    public string? Location { get; set; }
    public string? MeetUrl { get; set; }
    
    public bool IsSubscribed { get; set; }
}
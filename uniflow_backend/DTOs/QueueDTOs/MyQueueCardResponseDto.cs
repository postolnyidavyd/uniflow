namespace DTOs.QueueDTOs;

public class MyQueueCardResponseDto
{
    public Guid Id { get; set; }
    public required string ShortTitle { get; set; }
    public required string SubjectName { get; set; }
    
    public DateTime QueueStartTime { get; set; }
    public string? Location { get; set; }
    public string? MeetUrl { get; set; }
    
    public int UserPosition { get; set; }
    public bool IsGuaranteed { get; set; } 
    
    
    public string? CurrentStudentName { get; set; } 
    public int? EstimatedWaitMinutes { get; set; }
}
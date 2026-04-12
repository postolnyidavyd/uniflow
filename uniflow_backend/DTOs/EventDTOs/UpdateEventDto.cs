using Domain.Enums;

namespace DTOs.EventDTOs;

public class UpdateEventDto
{
    public string? Title { get; set; }
    public  string? ShortTitle { get; set; }
    public string? Description { get; set; }

    public DateTime? Date { get; set; }


    public EventType? EventType { get; set; }
    public EventFormat? EventFormat { get; set; }

    public string? Location { get; set; }
    public string? MeetUrl { get; set; }

    public Guid? SubjectId { get; set; }
}
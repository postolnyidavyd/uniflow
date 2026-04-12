using Domain.Enums;

namespace DTOs.EventDTOs;

public class CreateEventDto
{
    public required string Title { get; set; }
    public required string ShortTitle { get; set; }
    public string? Description { get; set; }

    public DateTime Date { get; set; }


    public EventType EventType { get; set; }
    public EventFormat EventFormat { get; set; }

    public string? Location { get; set; }
    public string? MeetUrl { get; set; }

    public Guid SubjectId { get; set; }
}
using Domain.Enums;

namespace DTOs.EventDTOs;

public class EventShortResponseDto
{
    public Guid Id { get; set; }
    public required string ShortTitle { get; set; }
    public DateTime Date { get; set; }
    public EventType EventType { get; set; }
    public bool IsSubscribed { get; set; }
    public required string SubjectName { get; set; }
}
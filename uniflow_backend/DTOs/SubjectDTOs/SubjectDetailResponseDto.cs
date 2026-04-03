using Domain.Models;

namespace DTOs.SubjectDTOs;

public class SubjectDetailResponseDto
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Lecturer { get; set; }
    public string? MarkdownContent { get; set; }
    //TODO Add Dto to send subject events\queue to front
    //
    // public ICollection<Event> Events { get; set; }
    // public ICollection<QueueSession> QueueSessions { get; set; }
}
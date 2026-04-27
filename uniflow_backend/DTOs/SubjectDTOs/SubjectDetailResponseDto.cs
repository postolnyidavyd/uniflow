using Domain.Models;

namespace DTOs.SubjectDTOs;

public class SubjectDetailResponseDto
{
    public Guid Id { get; set; }

    public required string Name { get; set; }

    public required string Lecturer { get; set; }
    public string? RenderedContent { get; set; }
}
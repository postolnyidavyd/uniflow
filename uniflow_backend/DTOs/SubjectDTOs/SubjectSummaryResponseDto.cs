namespace DTOs.SubjectDTOs;

public class SubjectSummaryResponseDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Lecturer { get; set; }
    public DateTime LastUpdatedAt { get; set; }
    public string? ImgUrl { get; set; }
}
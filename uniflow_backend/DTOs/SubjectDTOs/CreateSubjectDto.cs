using Microsoft.AspNetCore.Http;

namespace DTOs.SubjectDTOs;

public class CreateSubjectDto
{
    public required string Name { get; set; }
    public required string ShortName { get; set; }
    public required string Lecturer { get; set; }
    public IFormFile? CoverImage { get;set; }
}
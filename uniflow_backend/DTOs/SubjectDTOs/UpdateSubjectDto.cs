using Microsoft.AspNetCore.Http;

namespace DTOs.SubjectDTOs;

public class UpdateSubjectDto
{
    public string? Name { get; set; }
    public string? ShortName { get; set; }
    public string? Lecturer { get; set; }
    public IFormFile? CoverImage { get;set; }
    public bool RemoveExistingImage { get; set; }
}
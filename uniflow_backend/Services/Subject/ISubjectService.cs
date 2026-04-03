using DTOs.SubjectDTOs;

namespace Services.Subject;

public interface ISubjectService
{
    Task<IEnumerable<SubjectSummaryResponseDto>> GetAllSummariesAsync();
    Task<IEnumerable<SubjectShortResponseDto>> GetAllShortAsync();
    Task<SubjectDetailResponseDto> GetByIdAsync(Guid subjectId);
    Task<Guid> CreateSubjectAsync(Guid userId, CreateSubjectDto dto );
    Task UpdateSubjectAsync(Guid subjectId, UpdateSubjectDto dto);
    Task UpdateMarkdownContentAsync(Guid subjectId, UpdateMarkdownDto dto);
    
    Task DeleteSubjectAsync(Guid subjectId)
}
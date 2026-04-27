using DataAccess.Data;
using DTOs.SubjectDTOs;
using Microsoft.EntityFrameworkCore;
using Domain.Models;
using Microsoft.AspNetCore.Http;
using Services.Markdown;
using Services.Photo;

namespace Services.Subject;

public class SubjectService : ISubjectService
{
    private readonly AppDbContext _appDbContext;
    private readonly IPhotoService _photoService;
    private readonly IMarkdownParser _markdownParser;

    public SubjectService(AppDbContext appDbContext, IPhotoService photoService,IMarkdownParser markdownParser)
    {
        _appDbContext = appDbContext;
        _photoService = photoService;
        _markdownParser = markdownParser;
    }

    public async Task<IEnumerable<SubjectSummaryResponseDto>> GetAllSummariesAsync()
    {
        var subjectSummaries = await _appDbContext.Subjects.Select(s => new SubjectSummaryResponseDto()
            {
                Id = s.Id,
                Name = s.Name,
                Lecturer = s.Lecturer,
                ImgUrl = s.ImgUrl,
                LastUpdatedAt = s.LastUpdatedAt
            })
            .ToListAsync();

        return subjectSummaries;
    }

    public async Task<IEnumerable<SubjectShortResponseDto>> GetAllShortAsync()
    {
        var subjectSummaries = await _appDbContext.Subjects.Select(s => new SubjectShortResponseDto()
            {
                Id = s.Id,
                Name = s.Name,
            })
            .ToListAsync();

        return subjectSummaries;
    }

    public async Task<SubjectDetailResponseDto> GetByIdAsync(Guid subjectId)
    {
        var subject = await _appDbContext.Subjects
            .Where(s => s.Id == subjectId)
            .Select(subject =>
                new SubjectDetailResponseDto()
                {
                    Name = subject.Name,
                    Lecturer = subject.Lecturer,
                    Id = subject.Id,
                    RenderedContent = subject.MarkdownContent != null 
                        ? _markdownParser.Parse(subject.MarkdownContent) 
                        : null
                }).FirstOrDefaultAsync();

        if (subject == null)
            throw new KeyNotFoundException("Предмет не знайдено");

        return subject;
    }

    public async Task<Guid> CreateSubjectAsync(Guid userId, CreateSubjectDto dto)
    {
        bool exists = await _appDbContext.Subjects.AnyAsync(s => s.Name.ToLower() == dto.Name.ToLower());
        if (exists)
            throw new ArgumentException("Предмет з таким ім'ям вже існує");

        string? imgUrl = await UploadPhotoAsync(dto.CoverImage);

        var newSubject = new Domain.Models.Subject()
        {
            Name = dto.Name, ShortName = dto.ShortName, Lecturer = dto.Lecturer, ImgUrl = imgUrl,
            LastUpdatedAt = DateTime.UtcNow, CreatedByUserId = userId
        };

        await _appDbContext.Subjects.AddAsync(newSubject);
        await _appDbContext.SaveChangesAsync();

        return newSubject.Id;
    }

    public async Task UpdateSubjectAsync(Guid subjectId, UpdateSubjectDto dto)
    {
        var subject = await _appDbContext.Subjects.FindAsync(subjectId);
        if (subject == null)
            throw new KeyNotFoundException("Предмет не знайдено");

        if (!string.IsNullOrWhiteSpace(dto.Name) && dto.Name.ToLower() != subject.Name.ToLower())
        {
            bool exists = await _appDbContext.Subjects.AnyAsync(s => s.Name == dto.Name && s.Id != subjectId);
            if (exists)
                throw new ArgumentException("Предмет з такою назвою вже існує");

            subject.Name = dto.Name;
        }

        if (!string.IsNullOrWhiteSpace(dto.ShortName))
            subject.ShortName = dto.ShortName;
        if (!string.IsNullOrWhiteSpace(dto.Lecturer))
            subject.Lecturer = dto.Lecturer;

        if (dto.RemoveExistingImage)
        {
            // TODO: додати в IPhotoService метод DeleteImageAsync(string ImgUrl)
            subject.ImgUrl = null;
        }

        if (dto.CoverImage != null)
            subject.ImgUrl = await _photoService.UploadImageAsync(dto.CoverImage);


        subject.LastUpdatedAt = DateTime.UtcNow;


        await _appDbContext.SaveChangesAsync();
    }

    public async Task UpdateMarkdownContentAsync(Guid subjectId, UpdateMarkdownDto dto)
    {
        var subject = await _appDbContext.Subjects.FindAsync(subjectId);
        if (subject == null)
            throw new KeyNotFoundException("Предмет не знайдено");

        subject.MarkdownContent = dto.MarkdownContent;

        await _appDbContext.SaveChangesAsync();
    }

    public async Task DeleteSubjectAsync(Guid subjectId)
    {
        var subject = await _appDbContext.Subjects.FindAsync(subjectId);
        if (subject == null)
            throw new KeyNotFoundException("Предмет не знайдено");

        _appDbContext.Subjects.Remove(subject);

        await _appDbContext.SaveChangesAsync();
    }

    public async Task<string?> GetMarkdownContentAsync(Guid subjectId)
    {
        return await _appDbContext.Subjects
            .Where(s => s.Id == subjectId)
            .Select(s => s.MarkdownContent)
            .FirstOrDefaultAsync();
    }

    private async Task<string?> UploadPhotoAsync(IFormFile? file)
    {
        if (file != null)
            return await _photoService.UploadImageAsync(file);
        else
            return null;
    }
}
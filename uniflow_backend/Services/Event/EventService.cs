using DataAccess.Data;
using Domain.Enums;
using DTOs.EventDTOs;
using Microsoft.EntityFrameworkCore;
namespace Services.Event;

public class EventService : IEventService
{
    private readonly AppDbContext _appDbContext;

    public EventService(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task<IEnumerable<EventShortResponseDto>> GetBySubjectAsync(Guid userId, Guid subjectId)
    {
        var events = await _appDbContext.Events
            .Where(e => e.SubjectId == subjectId)
            .OrderBy(e=> e.Date)
            .ProjectToShortDto(userId)
            .ToListAsync();

        return events;
    }

    public async Task<EventDetailResponseDto> GetById(Guid userId, Guid eventId)
    {
        var eventDetail = await _appDbContext.Events
                              .Where(e => e.Id == eventId)
                              .ProjectToDetailDto(userId)
                              .FirstOrDefaultAsync() 
                          ?? throw new KeyNotFoundException("Подію не знайдено");

        return eventDetail;
    }

    public async Task CreateEventAsync(Guid userId, CreateEventDto dto)
    {
        if (!await _appDbContext.Subjects.AnyAsync(s => s.Id == dto.SubjectId))
            throw new KeyNotFoundException("Предмет, до якого ви намагаєтесь додати подію, не існує");

        var newEvent = new Domain.Models.Event()
        {
            Title = dto.Title,
            ShortTitle = dto.ShortTitle,
            Description = dto.Description,
            Date = dto.Date,
            EventType = dto.EventType,
            EventFormat = dto.EventFormat,
            Location = dto.Location,
            MeetUrl = dto.MeetUrl,
            SubjectId = dto.SubjectId,
            CreatedByUserId = userId,
        };
        await _appDbContext.Events.AddAsync(newEvent);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task UpdateEventAsync(Guid eventId, UpdateEventDto dto)
    {
        var updatedEvent = await _appDbContext.Events.FindAsync(eventId) ?? throw new KeyNotFoundException("Подію не знайдено");
        if (!string.IsNullOrWhiteSpace(dto.Title))
            updatedEvent.Title = dto.Title;
        if (!string.IsNullOrWhiteSpace(dto.ShortTitle))
            updatedEvent.ShortTitle = dto.ShortTitle;
        if (!string.IsNullOrWhiteSpace(dto.Description))
            updatedEvent.Description = dto.Description;
        if (dto.Date.HasValue)
            updatedEvent.Date = dto.Date.Value;
        if (dto.EventType.HasValue)
            updatedEvent.EventType = dto.EventType.GetValueOrDefault(updatedEvent.EventType);
        if (dto.EventFormat.HasValue)
            updatedEvent.EventFormat = dto.EventFormat.GetValueOrDefault(updatedEvent.EventFormat);
        if (!string.IsNullOrWhiteSpace(dto.Location))
            updatedEvent.Location = dto.Location;
        if (!string.IsNullOrWhiteSpace(dto.MeetUrl))
            updatedEvent.MeetUrl = dto.MeetUrl;
        if (dto.SubjectId.HasValue)
        {
            if (!await _appDbContext.Subjects.AnyAsync(s => s.Id == dto.SubjectId.Value))
                throw new KeyNotFoundException("Новий предмет не знайдено");
            
            updatedEvent.SubjectId = dto.SubjectId.GetValueOrDefault();
        }

        await _appDbContext.SaveChangesAsync();
    }

    public async Task DeleteEventAsync(Guid eventId)
    {
        var eventToDelete = await _appDbContext.Events.FindAsync(eventId)
                            ?? throw new KeyNotFoundException("Подію не знайдено");

        _appDbContext.Events.Remove(eventToDelete);

        await _appDbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<EventShortResponseDto>> GetUpcomingByTypeAsync(Guid userId, EventType type)
    {
        return await _appDbContext.Events
            .Where(e => e.Date >= DateTime.UtcNow && e.EventType == type)
            .OrderBy(e => e.Date)
            .Take(3)
            .ProjectToShortDto(userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<EventShortResponseDto>> GetUpcomingByTypeAsync(Guid userId, EventType type, Guid subjectId)
    {
        return await _appDbContext.Events
            .Where(e => e.Date >= DateTime.UtcNow && e.EventType == type)
            .Where(e=> e.SubjectId == subjectId)
            .OrderBy(e => e.Date)
            .Take(3)
            .ProjectToShortDto(userId)
            .ToListAsync();
    }
}
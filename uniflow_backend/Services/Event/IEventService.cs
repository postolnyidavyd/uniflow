using Domain.Enums;
using DTOs.EventDTOs;

namespace Services.Event;

public interface IEventService
{
    Task<IEnumerable<EventShortResponseDto>> GetBySubjectAsync(Guid userId, Guid subjectId);
    Task<EventDetailResponseDto> GetById(Guid userId, Guid eventId);
    Task CreateEventAsync(Guid userId, CreateEventDto dto);
    Task UpdateEventAsync(Guid eventId, UpdateEventDto dto);
    Task DeleteEventAsync(Guid eventId);
    
    Task<IEnumerable<EventShortResponseDto>> GetUpcomingByTypeAsync(Guid userId, EventType type);
    Task<IEnumerable<EventShortResponseDto>> GetUpcomingByTypeAsync(Guid userId, EventType type, Guid subjectId);
}
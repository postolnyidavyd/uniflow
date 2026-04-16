using System.Linq.Expressions;
using DTOs.EventDTOs;

namespace Services.Event;

public static class EventMappings
{
    private static Expression<Func<Domain.Models.Event, EventShortResponseDto>> ShortDtoExpression(Guid userId) =>
        e => new EventShortResponseDto
        {
            Id = e.Id,
            ShortTitle = e.ShortTitle,
            Date = e.Date,
            EventType = e.EventType,
            SubjectName = e.Subject.ShortName,
            IsSubscribed =
                e.Subscribers.Any(u => u.Id == userId) ||
                e.Subject.Subscribers.Any(s => s.Id == userId) ||
                e.Subject.Subscribers.Any(u =>
                    u.UserCalendarSettings != null &&
                    u.UserCalendarSettings.AutoAddAllEvents &&
                    u.Id == userId)
        };

    private static Expression<Func<Domain.Models.Event, EventDetailResponseDto>> DetailDtoExpression(Guid userId) =>
        e => new EventDetailResponseDto
        {
            Id = e.Id,
            Title = e.Title,
            ShortTitle = e.ShortTitle,
            Description = e.Description,
            Date = e.Date,
            EventType = e.EventType,
            EventFormat = e.EventFormat,
            Location = e.Location,
            MeetUrl = e.MeetUrl,
            SubjectId = e.SubjectId,
            SubjectName = e.Subject.Name,
            IsSubscribed =
                e.Subscribers.Any(u => u.Id == userId) ||
                e.Subject.Subscribers.Any(s => s.Id == userId) ||
                e.Subject.Subscribers.Any(u =>
                    u.UserCalendarSettings != null &&
                    u.UserCalendarSettings.AutoAddAllEvents &&
                    u.Id == userId)
        };

    public static IQueryable<EventShortResponseDto> ProjectToShortDto(
        this IQueryable<Domain.Models.Event> query, Guid userId) =>
        query.Select(ShortDtoExpression(userId));

    public static IQueryable<EventDetailResponseDto> ProjectToDetailDto(
        this IQueryable<Domain.Models.Event> query, Guid userId) =>
        query.Select(DetailDtoExpression(userId));

    public static Domain.Models.Event ToEntity(this CreateEventDto dto, Guid userId) => new()
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
        CreatedByUserId = userId
    };
}
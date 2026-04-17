using Domain.Enums;
using DTOs.CalendarDTOs;
using DTOs.EventDTOs;
using DTOs.QueueDTOs;

namespace Services.Calendar;

public static class CalendarMapping
{
    private static Func<EventSummaryResponseDto, CalendarItemDto> EventToItemDtoExpression => e => new CalendarItemDto()
    {
        Id = e.Id,
        ItemShortTitle = e.ShortTitle,
        SubjectShortName = e.SubjectName,
        StartTime = e.Date,
        Location = e.Location,
        MeetUrl = e.MeetUrl,
        IsSubscribed = e.IsSubscribed,
        CalendarItemType = e.EventType == EventType.GeneralEvent ? CalendarItemType.Event : CalendarItemType.Deadline
    };

    public static IEnumerable<CalendarItemDto> ProjectToCalendarItem(this IEnumerable<EventSummaryResponseDto> query) =>
        query.Select(EventToItemDtoExpression);
    
    private static Func<QueueSummaryResponseDto, CalendarItemDto> QueueToItemDtoExpression => q => new CalendarItemDto()
    {
        Id = q.Id,
        ItemShortTitle = q.ShortTitle,
        SubjectShortName = q.SubjectName,
        StartTime = q.QueueStartTime,
        Location = q.Location,
        MeetUrl = q.MeetUrl,
        IsSubscribed = q.IsSubscribed,
        CalendarItemType = CalendarItemType.Queue
    };

    public static IEnumerable<CalendarItemDto> ProjectToCalendarItem(this IEnumerable<QueueSummaryResponseDto> query) =>
        query.Select(QueueToItemDtoExpression);
}
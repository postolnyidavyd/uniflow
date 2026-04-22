using System.Linq.Expressions;
using Domain.Enums;
using Domain.Models;
using DTOs.CalendarDTOs;

namespace Services.Calendar;

public static class ICalMapping
{
    private static Expression<Func<Domain.Models.Event, ICalItem>> EventToICalItem => e => new ICalItem
    {
        Id = e.Id,
        Title = $"{e.Subject!.ShortName} — {e.ShortTitle}", 
        StartTime = e.Date,
        EndTime = e.Date.AddMinutes(80),
        Location = e.Location,
        Url = e.MeetUrl,
        ItemType = e.EventType == EventType.GeneralEvent ? ICalItemType.Event : ICalItemType.Deadline,
        
        Description = $"{e.Subject!.Name} — {e.Title}\n\n" +
                      $"📍 Локація/Посилання: {e.MeetUrl ?? e.Location ?? "Не вказано"}\n" +
                      $"📝 Деталі: {e.Description ?? "Відсутні"}"
    };

    public static IQueryable<ICalItem> ProjectToICalItem(this IQueryable<Domain.Models.Event> query) =>
        query.Select(EventToICalItem);

    private static Expression<Func<QueueSession, ICalItem>> QueueToICalItem => q => new ICalItem
    {
        Id = q.Id,
        Title = $"{q.Subject!.ShortName} — {q.ShortTitle}",
        StartTime = q.QueueStartTime,
        EndTime = q.QueueStartTime.Add(q.Duration),
        Location = q.Location,
        Url = q.MeetUrl,
        ItemType = ICalItemType.Queue,
        
        Description = $"{q.Subject!.Name} — {q.Title}\n\n" +
                      $"Формат: {q.EventFormat}\n" +
                      $"📍 Локація/Посилання: {q.MeetUrl ?? q.Location ?? "Не вказано"}\n\n" 
    };

    public static IQueryable<ICalItem> ProjectToICalItem(this IQueryable<QueueSession> query) =>
        query.Select(QueueToICalItem);
}
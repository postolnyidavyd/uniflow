using DataAccess.Data;
using Domain.Enums;
using Domain.Models;
using DTOs.CalendarDTOs;
using Microsoft.EntityFrameworkCore;
using Services.Event;
using Services.ICalBuilder;
using Services.Queue;

namespace Services.Calendar;

public class CalendarService : ICalendarService
{
    private readonly AppDbContext _appDbContext;
    private readonly IQueueService _queueService;
    private readonly IEventService _eventService;
    private readonly IICalbuilder _iCalbuilder;

    public CalendarService(AppDbContext appDbContext, IQueueService queueService, IEventService eventService,
        IICalbuilder iCalbuilder)
    {
        _appDbContext = appDbContext;
        _queueService = queueService;
        _eventService = eventService;
        _iCalbuilder = iCalbuilder;
    }


    public async Task<IEnumerable<CalendarItemDto>> GetMonthlyCalendarAsync(Guid userId, int year, int month)
    {
        var eventsTask = _eventService.GetEventsByMonthAsync(userId, year, month);
        var queuesTask = _queueService.GetSessionsByMonthAsync(userId, year, month);

        await Task.WhenAll(eventsTask, queuesTask);

        var eventsAndDeadlines = eventsTask.Result.ProjectToCalendarItem();
        var queues = queuesTask.Result.ProjectToCalendarItem();

        return eventsAndDeadlines
            .Concat(queues)
            .OrderBy(c => c.StartTime);
    }

    public async Task<UpcomingDashboardDto> GetUpcomingAsync(Guid userId)
    { 
        var events = await _eventService.GetUpcomingByTypeAsync(userId, EventType.GeneralEvent);
        var deadlines = await _eventService.GetUpcomingByTypeAsync(userId, EventType.DeadlineEvent);
        var queues = await _queueService.GetUpcomingAsync(userId);

        var dashboard = new UpcomingDashboardDto()
        {
            Events = events,
            Deadlines = deadlines,
            Queues = queues
        };

        return dashboard;
    }

    public async Task<UpcomingDashboardDto> GetUpcomingAsync(Guid userId, Guid subjectId)
    {
        var eventsTask = _eventService.GetUpcomingByTypeAsync(userId, EventType.GeneralEvent, subjectId);
        var deadlinesTask = _eventService.GetUpcomingByTypeAsync(userId, EventType.DeadlineEvent, subjectId);
        var queuesTask = _queueService.GetUpcomingAsync(userId, subjectId);

        await Task.WhenAll(eventsTask, deadlinesTask, queuesTask);

        var dashboard = new UpcomingDashboardDto()
        {
            Events = eventsTask.Result,
            Deadlines = deadlinesTask.Result,
            Queues = queuesTask.Result
        };

        return dashboard;
    }

    public async Task<Guid?> GetUserIdBySyncTokenAsync(string token)
    {
        var settings = await _appDbContext.UserCalendarSettings
            .FirstOrDefaultAsync(s => s.SyncToken == token);
        return settings?.UserId;
    }

    public async Task<string> GenerateICalContentAsync(Guid userId)
    {
        var startDate = DateTime.UtcNow.AddMonths(-1);
        var endDate = DateTime.UtcNow.AddMonths(6);

        var userCalendarSettings =
            await _appDbContext.UserCalendarSettings.FirstOrDefaultAsync(usc => usc.UserId == userId) ??
            throw new KeyNotFoundException("Користувача не знайдено");

        var eventsQuery = _appDbContext.Events
            .Where(e => e.Date >= startDate && e.Date <= endDate);

        var queuesQuery = _appDbContext.QueueSessions
            .Where(e => e.QueueStartTime >= startDate && e.QueueStartTime <= endDate);

        if (!userCalendarSettings.AutoAddAllEvents)
        {
            eventsQuery = eventsQuery.Where(e =>
                e.Subscribers.Any(u => u.Id == userId) ||
                e.Subject!.Subscribers.Any(u => u.Id == userId));

            queuesQuery = queuesQuery.Where(qs =>
                qs.Subscribers.Any(u => u.Id == userId) ||
                qs.QueueEntries.Any(qe =>
                    qe.UserId == userId &&
                    (qe.EntryStatus == QueueEntryStatus.Waiting || qe.EntryStatus == QueueEntryStatus.InProgress) &&
                    qe.User!.UserCalendarSettings!.AutoAddUserQueueEvents));
        }

        var events = await eventsQuery.ProjectToICalItem().ToListAsync();
        var queues = await queuesQuery.ProjectToICalItem().ToListAsync();

        return _iCalbuilder.BuildCalendar(events.Concat(queues));
    }
}
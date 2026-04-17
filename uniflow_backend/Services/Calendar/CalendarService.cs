using Domain.Enums;
using DTOs.CalendarDTOs;
using Services.Event;
using Services.Queue;

namespace Services.Calendar;

public class CalendarService : ICalendarService
{
    private readonly IQueueService _queueService;
    private readonly IEventService _eventService;

    public CalendarService(IQueueService queueService, IEventService eventService)
    {
        _queueService = queueService;
        _eventService = eventService;
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
        var eventsTask = _eventService.GetUpcomingByTypeAsync(userId, EventType.GeneralEvent);
        var deadlinesTask = _eventService.GetUpcomingByTypeAsync(userId, EventType.DeadlineEvent);
        var queuesTask = _queueService.GetUpcomingAsync(userId);
        
        await Task.WhenAll(eventsTask, deadlinesTask, queuesTask);
        
        var dashboard = new UpcomingDashboardDto()
        {
            Events = eventsTask.Result,
            Deadlines = deadlinesTask.Result,
            Queues = queuesTask.Result
        };
        
        return dashboard;
    }

    public async Task<UpcomingDashboardDto> GetUpcomingAsync(Guid userId, Guid subjectId)
    {
        var eventsTask = _eventService.GetUpcomingByTypeAsync(userId, EventType.GeneralEvent,subjectId);
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
}
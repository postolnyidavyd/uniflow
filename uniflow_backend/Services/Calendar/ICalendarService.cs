using DTOs.CalendarDTOs;

namespace Services.Calendar;

public interface ICalendarService
{
    
    Task<IEnumerable<CalendarItemDto>> GetMonthlyCalendarAsync(Guid userId, int year, int month);
    Task<UpcomingDashboardDto> GetUpcomingAsync(Guid userId);
    Task<UpcomingDashboardDto> GetUpcomingAsync(Guid userId, Guid subjectId);
    
    Task<Guid?> GetUserIdBySyncTokenAsync(string token);
    Task<string> GenerateICalContentAsync(Guid userId);
}
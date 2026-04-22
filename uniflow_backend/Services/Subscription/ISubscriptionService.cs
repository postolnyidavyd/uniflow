using DTOs.SubscriptionDTOs;

namespace Services.Subscription;

public interface ISubscriptionService
{
    //Метод для IAuthService при створенні юзера
    Task CreateUserCalendarSettings(Guid userId);
    
    Task<UserCalendarSettingsDto> GetUserCalendarSettings(Guid userId);
    
    Task ToggleSubjectSubscriptionAsync(Guid userId, Guid subjectId);
    Task ToggleEventSubscriptionAsync(Guid userId, Guid eventId);
    Task ToggleQueueSubscriptionAsync(Guid userId, Guid queueId);
    
    // Також додамо управління налаштуваннями календаря (Auto-add)
    Task ToggleAutoAddEvents(Guid userId);
    Task ToggleAutoAddQueues(Guid userId);
}
namespace DTOs.SubscriptionDTOs;

public class UserCalendarSettingsDto
{
    public bool AutoAddEvents { get; set; }
    public bool AutoAddQueues { get; set; }
    public string SyncToken { get; set; }
}
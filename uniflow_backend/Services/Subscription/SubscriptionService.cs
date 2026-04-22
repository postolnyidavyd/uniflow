using System.Security.Cryptography;
using DataAccess.Data;
using Domain.Models;
using DTOs.SubscriptionDTOs;
using Microsoft.EntityFrameworkCore;

namespace Services.Subscription;

public class SubscriptionService : ISubscriptionService
{
    private readonly AppDbContext _appDbContext;

    public SubscriptionService(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }
    
    
    public async Task CreateUserCalendarSettings(Guid userId)
    {
        var randomBytes = RandomNumberGenerator.GetBytes(32);
        var token = Convert.ToHexString(randomBytes).ToLower();
        await _appDbContext.UserCalendarSettings.AddAsync(new UserCalendarSettings()
        {
            AutoAddAllEvents = false,
            AutoAddUserQueueEvents = true,
            UserId = userId,
            SyncToken = token,
        });
        await _appDbContext.SaveChangesAsync();
    }

    public async Task<UserCalendarSettingsDto> GetUserCalendarSettings(Guid userId)
    {
        return await _appDbContext.UserCalendarSettings
            .Where(ucs => ucs.UserId == userId)
            .Select(ucs =>
            new UserCalendarSettingsDto()
            {
                AutoAddEvents = ucs.AutoAddAllEvents,
                AutoAddQueues = ucs.AutoAddUserQueueEvents,
                SyncToken = ucs.SyncToken
            })
            .FirstOrDefaultAsync() ?? throw new KeyNotFoundException("Користувача не знайдено");
    }

public async Task ToggleSubjectSubscriptionAsync(Guid userId, Guid subjectId)
    {
        var user = await _appDbContext.Users.FindAsync(userId) 
            ?? throw new KeyNotFoundException("Користувача не знайдено");
        
        await _appDbContext.Entry(user)
            .Collection(u => u.SubjectSubscriptions)
            .Query()
            .Where(s => s.Id == subjectId)
            .LoadAsync();

        var existingSubject = user.SubjectSubscriptions.FirstOrDefault();

        if (existingSubject != null)
        {
            user.SubjectSubscriptions.Remove(existingSubject);
        }
        else
        {
            var subjectToAdd = await _appDbContext.Subjects.FindAsync(subjectId)
                ?? throw new KeyNotFoundException("Предмет не знайдено");
                
            user.SubjectSubscriptions.Add(subjectToAdd);
        }

        await _appDbContext.SaveChangesAsync();
    }

    public async Task ToggleEventSubscriptionAsync(Guid userId, Guid eventId)
    {
        var user = await _appDbContext.Users.FindAsync(userId) 
            ?? throw new KeyNotFoundException("Користувача не знайдено");

        await _appDbContext.Entry(user)
            .Collection(u => u.EventSubscriptions)
            .Query()
            .Where(e => e.Id == eventId)
            .LoadAsync();

        var existingEvent = user.EventSubscriptions.FirstOrDefault();

        if (existingEvent != null)
        {
            user.EventSubscriptions.Remove(existingEvent);
        }
        else
        {
            var eventToAdd = await _appDbContext.Events.FindAsync(eventId)
                ?? throw new KeyNotFoundException("Подію не знайдено");
                
            user.EventSubscriptions.Add(eventToAdd);
        }

        await _appDbContext.SaveChangesAsync();
    }

    public async Task ToggleQueueSubscriptionAsync(Guid userId, Guid queueId)
    {
        var user = await _appDbContext.Users.FindAsync(userId) 
            ?? throw new KeyNotFoundException("Користувача не знайдено");

        await _appDbContext.Entry(user)
            .Collection(u => u.QueueSubscriptions)
            .Query()
            .Where(q => q.Id == queueId)
            .LoadAsync();

        var existingQueue = user.QueueSubscriptions.FirstOrDefault();

        if (existingQueue != null)
        {
            user.QueueSubscriptions.Remove(existingQueue);
        }
        else
        {
            var queueToAdd = await _appDbContext.QueueSessions.FindAsync(queueId)
                ?? throw new KeyNotFoundException("Чергу не знайдено");
                
            user.QueueSubscriptions.Add(queueToAdd);
        }

        await _appDbContext.SaveChangesAsync();
    }
    
    public async Task ToggleAutoAddEvents(Guid userId)
    {
        await _appDbContext.UserCalendarSettings
            .Where(ucs => ucs.UserId == userId)
            .ExecuteUpdateAsync(s =>
            s.SetProperty(ucs => ucs.AutoAddAllEvents, ucs => !ucs.AutoAddAllEvents));
    }

    public async Task ToggleAutoAddQueues(Guid userId)
    {
        await _appDbContext.UserCalendarSettings
            .Where(ucs => ucs.UserId == userId)
            .ExecuteUpdateAsync(s =>
                s.SetProperty(ucs => ucs.AutoAddUserQueueEvents, ucs => !ucs.AutoAddUserQueueEvents));
    }
}
using Microsoft.AspNetCore.Mvc;
using Services.Subscription;

namespace uniflow_backend.Controllers;

[ApiController]
[Route("api/subscriptions")]
public class SubscriptionController : RequireAuthController
{
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionController(ISubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetCalendarSettings()
    {
        var userId = GetUserId();
        var settings = await _subscriptionService.GetUserCalendarSettings(userId);
        return Ok(settings);
    }

    [HttpPut("settings/auto-add-events/toggle")]
    public async Task<IActionResult> ToggleAutoAddEvents()
    {
        var userId = GetUserId();
        await _subscriptionService.ToggleAutoAddEvents(userId);
        return Ok();
    }

    [HttpPut("settings/auto-add-queues/toggle")]
    public async Task<IActionResult> ToggleAutoAddQueues()
    {
        var userId = GetUserId();
        await _subscriptionService.ToggleAutoAddQueues(userId);
        return Ok();
    }

    [HttpPost("subjects/{subjectId:guid}/toggle")]
    public async Task<IActionResult> ToggleSubjectSubscription([FromRoute] Guid subjectId)
    {
        var userId = GetUserId();
        await _subscriptionService.ToggleSubjectSubscriptionAsync(userId, subjectId);
        return Ok();
    }

    [HttpPost("events/{eventId:guid}/toggle")]
    public async Task<IActionResult> ToggleEventSubscription([FromRoute] Guid eventId)
    {
        var userId = GetUserId();
        await _subscriptionService.ToggleEventSubscriptionAsync(userId, eventId);
        return Ok();
    }

    [HttpPost("queues/{queueId:guid}/toggle")]
    public async Task<IActionResult> ToggleQueueSubscription([FromRoute] Guid queueId)
    {
        var userId = GetUserId();
        await _subscriptionService.ToggleQueueSubscriptionAsync(userId, queueId);
        return Ok();
    }
}
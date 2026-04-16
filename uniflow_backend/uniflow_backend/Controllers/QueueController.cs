using Domain.Constants;
using DTOs.QueueDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Queue;

namespace uniflow_backend.Controllers;

[ApiController]
[Route("api/queue")]
public class QueueController : RequireAuthController
{
    private readonly IQueueService _queueService;

    public QueueController(IQueueService queueService)
    {
        _queueService = queueService;
    }

    [HttpGet("{sessionId:guid}")]
    public async Task<IActionResult> GetSessionById([FromRoute] Guid sessionId)
    {
        var userId = GetUserId();
        return Ok(await _queueService.GetSessionByIdAsync(userId, sessionId));
    }

    [HttpGet("{sessionId:guid}/entries")]
    public async Task<IActionResult> GetSessionEntries([FromRoute] Guid sessionId)
    {
        var userId = GetUserId();
        return Ok(await _queueService.GetSessionEntriesAsync(userId, sessionId));
    }
    [HttpPost("")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> CreateSession([FromBody] CreateQueueSessionDto dto)
    {
        var userId = GetUserId();
        await _queueService.CreateSessionAsync(userId, dto);
        return Ok();
    }

    [HttpPut("{sessionId:guid}")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> UpdateSession([FromRoute] Guid sessionId, [FromBody] UpdateQueueSessionDto dto)
    {
        await _queueService.UpdateSessionAsync(sessionId, dto);
        return Ok();
    }

    [HttpDelete("{sessionId:guid}")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> DeleteSession([FromRoute] Guid sessionId)
    {
        await _queueService.DeleteSessionAsync(sessionId);
        return Ok();
    }

    [HttpPost("{sessionId:guid}/join")]
    public async Task<IActionResult> JoinSession([FromRoute] Guid sessionId, [FromBody] JoinQueueDto dto)
    {
        var userId = GetUserId();
        await _queueService.JoinSessionAsync(userId, sessionId, dto);
        return Ok();
    }

    [HttpPost("{sessionId:guid}/leave")]
    public async Task<IActionResult> LeaveSession([FromRoute] Guid sessionId)
    {
        var userId = GetUserId();
        await _queueService.LeaveSessionAsync(userId, sessionId);
        return Ok();
    }

    [HttpPost("{sessionId:guid}/complete")]
    public async Task<IActionResult> CompleteCurrent([FromRoute] Guid sessionId)
    {
        var userId = GetUserId();
        await _queueService.CompleteCurrentAsync(userId, sessionId);
        return Ok();
    }

    [HttpPost("{sessionId:guid}/skip")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> SkipCurrent([FromRoute] Guid sessionId)
    {
        await _queueService.SkipCurrentAsync(sessionId);
        return Ok();
    }

    [HttpPost("{sessionId:guid}/force-complete")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> ForceCompleteCurrent([FromRoute] Guid sessionId)
    {
        await _queueService.ForceCompleteCurrentAsync(sessionId);
        return Ok();
    }
}
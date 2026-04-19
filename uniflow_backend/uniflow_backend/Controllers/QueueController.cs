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

    // 🔥 НОВЕ: Ендпоінт для блоку "Мої черги" (Червоні/Зелені/Жовті картки з макету)
    [HttpGet("my-active")]
    public async Task<IActionResult> GetMyActiveQueues()
    {
        var userId = GetUserId();
        return Ok(await _queueService.GetUserSession(userId));
    }

    // 🔥 НОВЕ: Ендпоінт для блоку "Всі черги" (З пагінацією та фільтрацією по предмету)
    [HttpGet("")]
    public async Task<IActionResult> GetAllSessions(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10, 
        [FromQuery] Guid? subjectId = null)
    {
        var userId = GetUserId();

        // Якщо з фронта передали subjectId (натиснули на таблетку-фільтр)
        if (subjectId.HasValue)
        {
            return Ok(await _queueService.GetAllSessions(userId, page, pageSize, subjectId.Value));
        }
        
        // Якщо предмет не обрано (кнопка "Всі предмети")
        return Ok(await _queueService.GetAllSessions(userId, page, pageSize));
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
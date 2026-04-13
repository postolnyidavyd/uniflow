using Domain.Constants;
using DTOs.EventDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Services.Event;

namespace uniflow_backend.Controllers;

[ApiController]
[Route("api/event")]
public class EventController : RequireAuthController
{
    private readonly IEventService _eventService;

    public EventController(IEventService eventService)
    {
        _eventService = eventService;
    }

    
    [HttpGet("subject/{subjectId}")]
    public async Task<IActionResult> GetEventsBySubject([FromRoute] Guid subjectId)
    {
        var userId = GetUserId();
        return Ok(await _eventService.GetBySubjectAsync(userId, subjectId));
    }
    
    [HttpGet("{eventId}")]
    public async Task<IActionResult> GetEventById([FromRoute] Guid eventId)
    {
        var userId = GetUserId();
        return Ok(await _eventService.GetByIdAsync(userId,eventId));
    }

    [HttpPost("")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
    {
        var userId = GetUserId();
        await _eventService.CreateEventAsync(userId, dto);
        
        return Ok();
    }

    [HttpPut("{eventId}")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> UpdateEvent([FromRoute] Guid eventId, [FromBody] UpdateEventDto dto)
    {
        await _eventService.UpdateEventAsync(eventId, dto);
        return Ok();
    }

    [HttpDelete("{eventId}")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> DeleteEvent([FromRoute] Guid eventId)
    {
        await _eventService.DeleteEventAsync(eventId);
        return Ok();
    }

}
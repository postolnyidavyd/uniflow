using Microsoft.AspNetCore.Mvc;
using Services.Calendar;

namespace uniflow_backend.Controllers;
[ApiController]
[Route("api/calendar")]
public class CalendarController : RequireAuthController
{
    private readonly ICalendarService _calendarService;

    public CalendarController(ICalendarService calendarService)
    {
        _calendarService = calendarService;
    }
    [HttpGet("")]
    public async Task<IActionResult> GetMonthlyCalendar([FromQuery] int year, [FromQuery] int month)
    {
        var userId = GetUserId();
        return Ok(await _calendarService.GetMonthlyCalendarAsync(userId, year, month));
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingForUser()
    {
        var userId = GetUserId();
        return Ok(await _calendarService.GetUpcomingAsync(userId));
    }

    [HttpGet("upcoming/subject/{subjectId:guid}")]
    public async Task<IActionResult> GetUpcomingForSubject([FromRoute] Guid subjectId)
    {
        var userId = GetUserId();
        return Ok(await _calendarService.GetUpcomingAsync(userId, subjectId));
    }

}
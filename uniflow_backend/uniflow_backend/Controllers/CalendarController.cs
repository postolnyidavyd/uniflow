using System.Text;
using Microsoft.AspNetCore.Authorization;
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
    
    [HttpGet("export/{token}.ics")]
    [AllowAnonymous]
    public async Task<IActionResult> ExportCalendar([FromRoute] string token)
    {
        var userId = await _calendarService.GetUserIdBySyncTokenAsync(token);
    
        if (userId == null)
            return Unauthorized("Недійсний токен синхронізації");

        string iCalContent = await _calendarService.GenerateICalContentAsync(userId.Value);

        var bytes = Encoding.UTF8.GetBytes(iCalContent);
        return File(bytes, "text/calendar", "uniflow-schedule.ics");
    }
}
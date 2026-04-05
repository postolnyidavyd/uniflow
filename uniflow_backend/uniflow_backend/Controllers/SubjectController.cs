using Domain.Constants;
using DTOs.SubjectDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Subject;

namespace uniflow_backend.Controllers;

[ApiController]
[Route("api/subject")]
public class SubjectController: RequireAuthController
{
    private readonly ISubjectService _subjectService;

    public SubjectController(ISubjectService subjectService)
    {
        _subjectService = subjectService;
    }

    [HttpGet("")]
    public async Task<IActionResult> GetSubjectSummaries()
    {
        return Ok(await _subjectService.GetAllSummariesAsync());
    }
    
    [HttpGet("{subjectId}")] 
    public async Task<IActionResult> GetSubjectById([FromRoute]Guid subjectId)
    {
        return Ok(await _subjectService.GetByIdAsync(subjectId));
    }

    [HttpPost("")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> CreateSubject([FromForm]CreateSubjectDto dto)
    {
        var userId = GetUserId();
        return Ok(await _subjectService.CreateSubjectAsync(userId, dto));
    }

    [HttpPut("{subjectId}")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> UpdateSubject([FromRoute] Guid subjectId, [FromForm] UpdateSubjectDto dto)
    {
        await _subjectService.UpdateSubjectAsync(subjectId, dto);
        return Ok();
    }

    [HttpPatch("{subjectId}/markdown")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> UpdateMarkdownContent([FromRoute] Guid subjectId, [FromBody] UpdateMarkdownDto dto)
    {
        await _subjectService.UpdateMarkdownContentAsync(subjectId, dto);
        return Ok();
    }

    [HttpDelete("{subjectId}")]
    [Authorize(Roles = Roles.Headman)]
    public async Task<IActionResult> DeleteSubject([FromRoute] Guid subjectId)
    {
        await _subjectService.DeleteSubjectAsync(subjectId);
        return Ok();
    }


}
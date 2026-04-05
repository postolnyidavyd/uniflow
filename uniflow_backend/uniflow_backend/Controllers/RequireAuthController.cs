using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace uniflow_backend.Controllers;
[Authorize]
public class RequireAuthController : ControllerBase
{
    protected Guid GetUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    protected string GetUserRole() => User.FindFirstValue(ClaimTypes.Role)!;

}
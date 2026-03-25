using Microsoft.AspNetCore.Identity;

namespace Domain.Models;

public class User : IdentityUser<Guid>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Group { get; set; }

    public StudentWallet StudentWallet { get; set; }
    // Можливо буде навігаційна властивість
    //public required string CalendarToken { get; set; }
}
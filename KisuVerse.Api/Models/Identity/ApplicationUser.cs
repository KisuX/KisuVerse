using KisuVerse.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace KisuVerse.Api.Models.Identity;

public class ApplicationUser : IdentityUser<int>
{
    public DateTime CreatedAt { get; set; }

    public string DisplayName { get; set; } = string.Empty;

    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
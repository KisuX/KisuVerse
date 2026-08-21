
using KisuVerse.Api.Models.Identity;

namespace KisuVerse.Api.Services.Interfaces;

public interface IJwtService
{
    Task<string> GenerateAccessToken(ApplicationUser user);
    string GenerateRefreshToken();
}
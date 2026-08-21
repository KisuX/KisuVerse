
using System.ComponentModel.DataAnnotations;

namespace KisuVerse.Api.Dtos.Auth;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
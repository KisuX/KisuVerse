namespace KisuVerse.Api.Dtos.Auth;

public class ProfileDto
{
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int WatchedCount { get; set; }
    public int FavoriteCount { get; set; }
    public int WatchlistCount { get; set; }
    public int ReviewCount { get; set; }
}

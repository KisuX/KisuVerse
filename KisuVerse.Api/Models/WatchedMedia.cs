using KisuVerse.Api.Models.Identity;

namespace KisuVerse.Api.Models;

public class WatchedMedia
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;

    public int MediaId { get; set; }
    public Media Media { get; set; } = null!;

    public DateTime WatchedAt { get; set; } = DateTime.UtcNow;
}
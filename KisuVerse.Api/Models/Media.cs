using KisuVerse.Api.Models.Identity;

namespace KisuVerse.Api.Models;

public class Media
{
    public int Id { get; set; }
    public int TmdbId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? OriginalTitle { get; set; }
    public string Overview { get; set; } = string.Empty;
    public string? PosterPath { get; set; }
    public string? BackdropPath { get; set; }
    public string? TrailerUrl { get; set; }
    public string Language { get; set; } = string.Empty;
    public string? Country { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public int Duration { get; set; }
    public string ProductionCompany { get; set; } = string.Empty;
    public string Awards { get; set; } = string.Empty;
    public double Rating { get; set; }
    public int VoteCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int CreatedByUserId { get; set; }

    public ApplicationUser CreatedByUser { get; set; } = null!;
    public ICollection<MediaGenre> MediaGenres { get; set; } = new List<MediaGenre>();
    public ICollection<MediaPerson> MediaPeople { get; set; } = new List<MediaPerson>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<WatchedMedia> WatchedMedias { get; set; } = new List<WatchedMedia>();

}
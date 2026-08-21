namespace KisuVerse.Api.Dtos.Media;

public class MediaDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? OriginalTitle { get; set; }
    public bool IsFavorite { get; set; }
    public bool IsInWatchlist { get; set; }
    public bool IsWatched { get; set; }
    public string Overview { get; set; } = string.Empty;
    public List<MediaCastDto> Cast { get; set; } = new();
    public List<MediaCrewDto> Crew { get; set; } = new();
    public List<string> Genres { get; set; } = new();
    public string PosterUrl { get; set; } = string.Empty;
    public string BackdropUrl { get; set; } = string.Empty;
    public string TrailerUrl { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public DateOnly ReleaseDate { get; set; }
    public int Duration { get; set; }
    public string ProductionCompany { get; set; } = string.Empty;
    public string Awards { get; set; } = string.Empty;
    public double Rating { get; set; }
    public int VoteCount { get; set; }

}
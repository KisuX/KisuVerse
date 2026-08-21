namespace KisuVerse.Api.Dtos.Media;

public class UpdateMediaDto
{
    public string Title { get; set; } = null!;
    public string? OriginalTitle { get; set; }
    public string Overview { get; set; } = string.Empty;
    public string Director { get; set; } = string.Empty;
    public string Writer { get; set; } = string.Empty;
    public List<int> GenreIds { get; set; } = new List<int>();
    public string Cast { get; set; } = string.Empty;
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

}
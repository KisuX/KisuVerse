namespace KisuVerse.Api.Dtos.Media;

public class WatchedMediaDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? PosterPath { get; set; }
    public int? ReleaseYear { get; set; }
    public double? AverageRating { get; set; }
    public DateTime WatchedAt { get; set; }
}

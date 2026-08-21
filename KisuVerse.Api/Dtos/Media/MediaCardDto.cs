namespace KisuVerse.Api.Dtos.Media;

public class MediaCardDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? PosterPath { get; set; }

    public string? BackdropPath { get; set; }

    public int? ReleaseYear { get; set; }

    public double? AverageRating { get; set; }
}
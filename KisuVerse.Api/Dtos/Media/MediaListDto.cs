namespace KisuVerse.Api.Dtos.Media;

public class MediaListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string PosterUrl { get; set; } = string.Empty;
    public DateOnly ReleaseDate { get; set; }
    public double Rating { get; set; }
    public List<string> Genres { get; set; } = new();
    public string CreatedByUserEmail { get; set; } = string.Empty;

}
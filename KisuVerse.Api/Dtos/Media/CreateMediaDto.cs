namespace KisuVerse.Api.Dtos.Media;

using System.ComponentModel.DataAnnotations;

public class CreateMediaDto
{
    [Required, StringLength(200)]
    public string Title { get; set; } = string.Empty;

    public string? OriginalTitle { get; set; }

    [Required, StringLength(2000)]
    public string Overview { get; set; } = string.Empty;

    [Required, StringLength(100)]
    public string Director { get; set; } = string.Empty;

    [StringLength(100)]
    public string Writer { get; set; } = string.Empty;
    [Required]
    public List<int> GenreIds { get; set; } = new List<int>();

    [StringLength(500)]
    public string Cast { get; set; } = string.Empty;

    public string PosterUrl { get; set; } = string.Empty;
    public string BackdropUrl { get; set; } = string.Empty;
    public string TrailerUrl { get; set; } = string.Empty;

    [Required]
    public string Language { get; set; } = string.Empty;

    [Required]
    public string Country { get; set; } = string.Empty;

    [Required]
    public DateOnly ReleaseDate { get; set; }

    [Range(1, 500, ErrorMessage = "Duration must be between 1 and 500.")]
    public int Duration { get; set; }

    public string ProductionCompany { get; set; } = string.Empty;

    [StringLength(200)]
    public string Awards { get; set; } = string.Empty;

    [Range(0, 10, ErrorMessage = "Rating must be between 0 and 10.")]
    public double Rating { get; set; }
}
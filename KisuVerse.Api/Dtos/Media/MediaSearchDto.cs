using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KisuVerse.Api.Dtos.Media;

public class MediaSearchDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? OriginalTitle { get; set; }
    public string? PosterUrl { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public double Rating { get; set; }

}
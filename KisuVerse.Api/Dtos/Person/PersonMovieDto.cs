using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KisuVerse.Api.Dtos.Person;

public class PersonMovieDto
{
    public int MediaId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string PosterUrl { get; set; } = string.Empty;
    public string? Character { get; set; }
    public string? Job { get; set; }
    public string? Department { get; set; }
    public DateOnly ReleaseDate { get; set; }
    public double AverageRating { get; set; }
}
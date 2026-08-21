using System.Text.Json.Serialization;

namespace KisuVerse.Api.Dtos.Tmdb;

public class TmdbSearchResponseDto
{
    [JsonPropertyName("page")]
    public int Page { get; set; }

    [JsonPropertyName("results")]
    public List<TmdbMovieDto> Results { get; set; } = new List<TmdbMovieDto>();

    [JsonPropertyName("total_results")]
    public int TotalResults { get; set; }

    [JsonPropertyName("total_pages")]
    public int TotalPages { get; set; }
}
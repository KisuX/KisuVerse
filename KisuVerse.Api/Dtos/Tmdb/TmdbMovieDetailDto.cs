using System.Text.Json.Serialization;
using KisuVerse.Api.Converters;

namespace KisuVerse.Api.Dtos.Tmdb;

public class TmdbMovieDetailDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("original_title")]
    public string OriginalTitle { get; set; } = string.Empty;

    [JsonPropertyName("overview")]
    public string Overview { get; set; } = string.Empty;

    [JsonPropertyName("poster_path")]
    public string PosterPath { get; set; } = string.Empty;

    [JsonPropertyName("backdrop_path")]
    public string BackdropPath { get; set; } = string.Empty;

    [JsonPropertyName("release_date")]
    [JsonConverter(typeof(NullableDateOnlyConverter))]
    public DateOnly? ReleaseDate { get; set; }

    [JsonPropertyName("runtime")]
    public int? Runtime { get; set; }

    [JsonPropertyName("vote_average")]
    public double VoteAverage { get; set; }

    [JsonPropertyName("vote_count")]
    public int VoteCount { get; set; }

    [JsonPropertyName("original_language")]
    public string OriginalLanguage { get; set; } = string.Empty;

    [JsonPropertyName("genres")]
    public List<TmdbGenreDto> Genres { get; set; } = new();
    [JsonPropertyName("production_countries")]
    public List<TmdbProductionCountryDto> ProductionCountries { get; set; } = new();

    [JsonPropertyName("production_companies")]
    public List<TmdbProductionCompanyDto> ProductionCompanies { get; set; } = new();

}


public class TmdbGenreDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}
using System.Text.Json.Serialization;

namespace KisuVerse.Api.Dtos.Tmdb;

public class TmdbCreditsDto
{
    [JsonPropertyName("cast")]
    public List<TmdbCastDto> Cast { get; set; } = new();

    [JsonPropertyName("crew")]
    public List<TmdbCrewDto> Crew { get; set; } = new();
}

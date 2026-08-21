using System.Text.Json.Serialization;

namespace KisuVerse.Api.Dtos.Tmdb;

public class TmdbPersonDetailDto
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("profile_path")]
    public string? ProfileImagePath { get; set; }

    [JsonPropertyName("place_of_birth")]
    public string? PlaceOfBirth { get; set; }

    [JsonPropertyName("known_for_department")]
    public string? KnownForDepartment { get; set; }

    public string? Biography { get; set; }

    public string? Birthday { get; set; }

    [JsonPropertyName("deathday")]
    public string? DeathDay { get; set; }

    public double Popularity { get; set; }
}
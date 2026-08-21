using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace KisuVerse.Api.Dtos.Tmdb
{
    public class TmdbCrewDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("job")]
        public string Job { get; set; } = string.Empty;
        [JsonPropertyName("department")]
        public string Department { get; set; } = string.Empty;
        [JsonPropertyName("profile_path")]
        public string? ProfilePath { get; set; }

        [JsonPropertyName("popularity")]
        public double Popularity { get; set; }
    }
}
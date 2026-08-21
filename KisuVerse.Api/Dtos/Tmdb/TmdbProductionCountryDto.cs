using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace KisuVerse.Api.Dtos.Tmdb
{
    public class TmdbProductionCountryDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}
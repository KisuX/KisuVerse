using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace KisuVerse.Api.Dtos.Tmdb
{
    public class TmdbProductionCompanyDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}
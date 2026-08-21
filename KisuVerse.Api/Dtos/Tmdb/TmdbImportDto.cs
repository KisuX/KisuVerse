using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KisuVerse.Api.Dtos.Tmdb
{
    public class TmdbImportDto
    {
        public TmdbMovieDetailDto Detail { get; set; } = null!;
        public TmdbCreditsDto Credits { get; set; } = null!;
        public TmdbVideosDto Videos { get; set; } = null!;
    }
}
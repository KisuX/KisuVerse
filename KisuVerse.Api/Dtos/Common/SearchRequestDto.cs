using KisuVerse.Api.Enums;

namespace KisuVerse.Api.Dtos.Common;

public class SearchRequestDto
{
    public string? Query { get; set; } = string.Empty;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;

    public MediaSortBy SortBy { get; set; } = MediaSortBy.TitleAsc;

    public int? GenreId { get; set; }

    public int? MinVoteCount { get; set; }

    public int? Year { get; set; }

    public double? MinRating { get; set; }
}
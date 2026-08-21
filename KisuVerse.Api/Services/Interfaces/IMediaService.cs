using KisuVerse.Api.Dtos.Common;
using KisuVerse.Api.Dtos.Media;
using KisuVerse.Api.Dtos.Review;

namespace KisuVerse.Api.Services.Interfaces;

public interface IMediaService
{
    Task<List<MediaListDto>> GetAllMedia();
    Task<MediaDetailDto> AddMedia(CreateMediaDto dto, int userId);
    Task<MediaDetailDto?> UpdateMedia(int id, UpdateMediaDto dto, int userId);
    Task<MediaDetailDto?> GetMediaById(int id, int? userId);
    Task<bool> DeleteMedia(int id, int userId);
    Task<MediaDetailDto?> ImportMediaFromTmdb(int tmdbId, int userId);
    Task<PagedResultDto<MediaCardDto>> SearchAsync(SearchRequestDto dto);
    Task<List<MediaSearchDto>> GetSimilarMovies(int mediaId);
    Task<List<MediaCardDto>> GetMoviesByGenre(int genreId, int page, int userId);
    Task<List<GenreDto>> GetGenres();
    Task<List<MediaCardDto>> GetTrending(int take, int? genreId);
    Task<int> SeedPopularMovies(int pages, int userId);
    Task<int> SeedByCategories(int perGenre, int userId);
    Task<int> SeedTopRatedMovies(int count, int userId);
    Task AddFavorite(int mediaId, int userId);
    Task<bool> RemoveFavorite(int mediaId, int userId);
    Task<List<MediaListDto>> GetMyFavorites(int userId);

    // REVIEW
    Task CreateReview(int mediaId, int userId, CreateReviewDto dto);
    Task<List<ReviewDto>> GetReviews(int mediaId);
    Task UpdateReview(int reviewId, int userId, CreateReviewDto dto);
    Task DeleteReview(int reviewId, int userId);

    // WATCHLIST
    Task AddToWatchlist(int mediaId, int userId);

    Task RemoveFromWatchlist(int mediaId, int userId);

    Task<List<MediaCardDto>> GetMyWatchlist(int userId);

    // WATCHED
    Task AddToWatched(int mediaId, int userId);

    Task RemoveFromWatched(int mediaId, int userId);

    Task<List<WatchedMediaDto>> GetMyWatched(int userId);
}
using KisuVerse.Api.Data;
using KisuVerse.Api.Models;
using KisuVerse.Api.Dtos.Media;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using KisuVerse.Api.Dtos.Tmdb;
using KisuVerse.Api.Services.Interfaces;
using System.Security.Principal;
using KisuVerse.Api.Dtos.Review;
using KisuVerse.Api.Dtos.Common;
using KisuVerse.Api.Enums;


namespace KisuVerse.Api.Services;

public class MediaService : IMediaService
{
    private readonly AppDbContext _context;
    private readonly TmdbService _tmdbService;
    private readonly IMapper _mapper;

    public MediaService(AppDbContext context, TmdbService tmdbService, IMapper mapper)
    {
        _context = context;
        _tmdbService = tmdbService;
        _mapper = mapper;
    }
    public async Task<List<MediaListDto>> GetAllMedia()
    {
        return await _context.Media
        .ProjectTo<MediaListDto>(_mapper.ConfigurationProvider)
        .ToListAsync();
    }
    public async Task<MediaDetailDto> AddMedia(CreateMediaDto dto, int userId)
    {
        var media = _mapper.Map<Media>(dto);
        media.CreatedByUserId = userId;

        foreach (var genreId in dto.GenreIds.Distinct())
        {
            media.MediaGenres.Add(new MediaGenre { GenreId = genreId });
        }

        await _context.Media.AddAsync(media);
        await _context.SaveChangesAsync();
        media = await _context.Media
            .Include(m => m.MediaGenres)
                .ThenInclude(mg => mg.Genre)
            .FirstOrDefaultAsync(m => m.Id == media.Id);

        return _mapper.Map<MediaDetailDto>(media);
    }
    public async Task<MediaDetailDto?> UpdateMedia(int id, UpdateMediaDto dto, int userId)
    {
        var media = await _context.Media
            .Include(m => m.MediaGenres)
            .ThenInclude(mg => mg.Genre)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (media == null)
        {
            return null;
        }

        if (media.CreatedByUserId != userId)
        {
            throw new UnauthorizedAccessException();
        }

        _mapper.Map(dto, media);

        _context.MediaGenres.RemoveRange(media.MediaGenres);
        media.MediaGenres.Clear();

        foreach (var genreId in dto.GenreIds.Distinct())
        {
            media.MediaGenres.Add(new MediaGenre
            {
                MediaId = media.Id,
                GenreId = genreId
            });
        }

        await _context.SaveChangesAsync();

        var updatedMedia = await _context.Media
            .Include(m => m.MediaGenres)
            .ThenInclude(mg => mg.Genre)
            .FirstAsync(m => m.Id == media.Id);

        return _mapper.Map<MediaDetailDto>(updatedMedia);
    }
    public async Task<MediaDetailDto?> GetMediaById(int id, int? userId)
    {
        var media = await _context.Media
            .Include(m => m.MediaGenres)
                .ThenInclude(mg => mg.Genre)
            .Include(m => m.MediaPeople)
                .ThenInclude(mp => mp.Person)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (media == null)
        {
            return null;
        }

        var isFavorite = await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.MediaId == media.Id);

        var isInWatchlist = await _context.Watchlists
            .AnyAsync(w => w.UserId == userId && w.MediaId == media.Id);

        var isWatched = await _context.WatchedMedias
            .AnyAsync(w => w.UserId == userId && w.MediaId == media.Id);

        var dto = _mapper.Map<MediaDetailDto>(media);

        dto.IsFavorite = isFavorite;
        dto.IsInWatchlist = isInWatchlist;
        dto.IsWatched = isWatched;

        return dto;
    }
    public async Task<bool> DeleteMedia(int id, int userId)
    {
        var media = await _context.Media.FirstOrDefaultAsync(m => m.Id == id);
        if (media == null)
        {
            return false;
        }
        if (media.CreatedByUserId != userId)
        {
            throw new UnauthorizedAccessException();
        }
        _context.Media.Remove(media);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<MediaDetailDto?> ImportMediaFromTmdb(int tmdbId, int userId)
    {
        var existingMedia = await _context.Media
            .FirstOrDefaultAsync(x => x.TmdbId == tmdbId);

        if (existingMedia != null)
        {
            return await GetMediaById(existingMedia.Id, userId);
        }

        var detail = await _tmdbService.GetMovieDetails(tmdbId);
        var credits = await _tmdbService.GetMovieCredits(tmdbId);
        var videos = await _tmdbService.GetMovieVideos(tmdbId);

        if (detail == null || credits == null || videos == null)
        {
            return null;
        }

        var media = CreateMedia(detail, videos, userId);
        _context.Media.Add(media);
        await AddGenres(media, detail.Genres);
        await AddPeople(media, credits);
        await _context.SaveChangesAsync();

        return await GetMediaById(media.Id, userId);
    }
    private Media CreateMedia(TmdbMovieDetailDto detail, TmdbVideosDto videos, int userId)
    {
        var media = new Media
        {
            TmdbId = detail.Id,
            Title = detail.Title,
            OriginalTitle = detail.OriginalTitle,
            Overview = detail.Overview,
            ReleaseDate = detail.ReleaseDate ?? DateOnly.MinValue,
            PosterPath = detail.PosterPath,
            BackdropPath = detail.BackdropPath,
            Duration = detail.Runtime ?? 0,
            Language = detail.OriginalLanguage,
            ProductionCompany = detail.ProductionCompanies.FirstOrDefault()?.Name ?? string.Empty,
            Country = detail.ProductionCountries.FirstOrDefault()?.Name ?? string.Empty,
            Rating = detail.VoteAverage,
            VoteCount = detail.VoteCount,
            TrailerUrl = GetTrailerUrl(videos),
            CreatedByUserId = userId

        };

        return media;
    }
    private async Task AddPeople(Media media, TmdbCreditsDto credits)
    {
        foreach (var cast in credits.Cast)
        {
            var person = _context.People.Local.FirstOrDefault(p => p.TmdbId == cast.Id);
            person ??= await _context.People.FirstOrDefaultAsync(p => p.TmdbId == cast.Id);
            if (person == null)
            {
                person = new Person
                {
                    TmdbId = cast.Id,
                    Name = cast.Name,
                    ProfileImagePath = cast.ProfilePath,
                    Popularity = cast.Popularity,
                    KnownForDepartment = "Acting"
                };
                _context.People.Add(person);
            }

            var mediaPerson = new MediaPerson
            {
                Media = media,
                Person = person,
                Department = "Acting",
                Job = "Actor",
                Character = cast.Character,
                Order = cast.Order
            };
            media.MediaPeople.Add(mediaPerson);
        }

        foreach (var crew in credits.Crew)
        {
            var person = _context.People.Local.FirstOrDefault(p => p.TmdbId == crew.Id);
            person ??= await _context.People.FirstOrDefaultAsync(p => p.TmdbId == crew.Id);
            if (person == null)
            {
                person = new Person
                {
                    TmdbId = crew.Id,
                    Name = crew.Name,
                    ProfileImagePath = crew.ProfilePath,
                    Popularity = crew.Popularity,
                    KnownForDepartment = crew.Department

                };
                _context.People.Add(person);
            }

            var mediaPerson = new MediaPerson
            {
                Media = media,
                Person = person,
                Department = crew.Department,
                Job = NormalizeJob(crew),
            };
            media.MediaPeople.Add(mediaPerson);
        }
    }
    private async Task AddGenres(Media media, List<TmdbGenreDto> genres)
    {
        foreach (var genreDto in genres)
        {
            var genre = await _context.Genres.FirstOrDefaultAsync(g => g.TmdbId == genreDto.Id);
            if (genre == null)
            {
                continue;
            }

            var mediaGenre = new MediaGenre
            {
                Media = media,
                Genre = genre
            };
            media.MediaGenres.Add(mediaGenre);
        }
    }
    private string NormalizeJob(TmdbCrewDto crew)
    {
        if (crew.Department == "Directing" && crew.Job == "Director")
            return "Director";

        if (crew.Department == "Writing")
        {
            if (crew.Job == "Screenplay" || crew.Job == "Writer")
                return "Writer";
        }

        if (crew.Department == "Acting")
            return "Actor";

        return crew.Job;
    }
    private string? GetTrailerUrl(TmdbVideosDto videos)
    {
        var trailer = videos.Results.FirstOrDefault(v => v.Type == "Trailer" && v.Site == "YouTube" && v.Official);
        if (trailer != null)
        {
            return $"https://www.youtube.com/watch?v={trailer.Key}";
        }
        return null;
    }
    public async Task<PagedResultDto<MediaCardDto>> SearchAsync(SearchRequestDto dto)
    {
        var query = _context.Media.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(dto.Query))
        {
            query = query.Where(m =>
                 EF.Functions.ILike(m.Title, $"%{dto.Query}%") ||
                (m.OriginalTitle != null && EF.Functions.ILike(m.OriginalTitle, $"%{dto.Query}%")));
        }

        if (dto.GenreId.HasValue)
        {
            query = query.Where(m => m.MediaGenres.Any(mg => mg.GenreId == dto.GenreId.Value));
        }

        if (dto.MinVoteCount.HasValue)
        {
            query = query.Where(m => m.VoteCount >= dto.MinVoteCount.Value);
        }

        if (dto.Year.HasValue)
        {
            query = query.Where(m => m.ReleaseDate.Year == dto.Year.Value);
        }

        if (dto.MinRating.HasValue)
        {
            query = query.Where(m => m.Rating >= dto.MinRating.Value);
        }

        query = dto.SortBy switch
        {
            MediaSortBy.TitleAsc =>
                query.OrderBy(m => m.Title),

            MediaSortBy.TitleDesc =>
                query.OrderByDescending(m => m.Title),

            MediaSortBy.RatingDesc =>
                query.OrderByDescending(m => m.Rating),

            MediaSortBy.ReleaseDateDesc =>
                query.OrderByDescending(m => m.ReleaseDate),

            MediaSortBy.PopularityDesc =>
                query.OrderByDescending(m => m.VoteCount),

            MediaSortBy.RecentlyAddedDesc =>
                query.OrderByDescending(m => m.CreatedAt),

            _ =>
                query.OrderBy(m => m.Title)
        };

        var totalCount = await query.CountAsync();

        var skip = (dto.Page - 1) * dto.PageSize;

        var medias = await query
            .Skip(skip)
            .Take(dto.PageSize)
            .ToListAsync();

        var mediaDtos = _mapper.Map<List<MediaCardDto>>(medias);

        return new PagedResultDto<MediaCardDto>
        {
            Items = mediaDtos,
            Page = dto.Page,
            PageSize = dto.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling((double)totalCount / dto.PageSize)
        };
    }
    public async Task<List<MediaSearchDto>> GetSimilarMovies(int mediaId)
    {
        var media = await _context.Media
            .FirstOrDefaultAsync(m => m.Id == mediaId);
        if (media == null)
        {
            return [];
        }

        var similar = await _tmdbService.GetSimilarMovies(media.TmdbId);
        if (similar == null)
        {
            return [];
        }

        return _mapper.Map<List<MediaSearchDto>>(similar.Results);
    }

    public async Task<List<MediaCardDto>> GetMoviesByGenre(int genreId, int page, int userId)
    {
        var genre = await _context.Genres.FirstOrDefaultAsync(g => g.Id == genreId);
        if (genre == null)
        {
            return [];
        }

        var discoverResult = await _tmdbService.DiscoverMoviesByGenre(genre.TmdbId, page);
        if (discoverResult == null)
        {
            return [];
        }

        var mediaIds = new List<int>();

        foreach (var tmdbMovie in discoverResult.Results)
        {
            var imported = await ImportMediaFromTmdb(tmdbMovie.Id, userId);
            if (imported != null)
            {
                mediaIds.Add(imported.Id);
            }
        }

        var mediaCards = await _context.Media
            .Where(m => mediaIds.Contains(m.Id))
            .ProjectTo<MediaCardDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return mediaCards
            .OrderBy(m => mediaIds.IndexOf(m.Id))
            .ToList();
    }

    public async Task<List<GenreDto>> GetGenres()
    {
        return await _context.Genres
            .OrderBy(g => g.Name)
            .Select(g => new GenreDto { Id = g.Id, Name = g.Name })
            .ToListAsync();
    }

    public async Task<List<MediaCardDto>> GetTrending(int take, int? genreId)
    {
        var watchedQuery = _context.WatchedMedias.AsQueryable();

        if (genreId.HasValue)
        {
            watchedQuery = watchedQuery.Where(w => w.Media.MediaGenres.Any(mg => mg.GenreId == genreId.Value));
        }

        var topMediaIds = await watchedQuery
            .GroupBy(w => w.MediaId)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .Take(take)
            .ToListAsync();

        var mediaCards = await _context.Media
            .Where(m => topMediaIds.Contains(m.Id))
            .ProjectTo<MediaCardDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return mediaCards
            .OrderBy(m => topMediaIds.IndexOf(m.Id))
            .ToList();
    }

    public async Task<int> SeedPopularMovies(int pages, int userId)
    {
        var tmdbIds = new List<int>();

        for (var page = 1; page <= pages; page++)
        {
            var popular = await _tmdbService.GetPopularMovies(page);
            if (popular != null)
            {
                tmdbIds.AddRange(popular.Results.Select(m => m.Id));
            }

            var topRated = await _tmdbService.GetTopRatedMovies(page);
            if (topRated != null)
            {
                tmdbIds.AddRange(topRated.Results.Select(m => m.Id));
            }
        }

        var imported = 0;

        foreach (var tmdbId in tmdbIds.Distinct())
        {
            var media = await ImportMediaFromTmdb(tmdbId, userId);
            if (media != null)
            {
                imported++;
            }
        }

        return imported;
    }

    public async Task<int> SeedTopRatedMovies(int count, int userId)
    {
        var tmdbIds = new List<int>();
        var pages = (int)Math.Ceiling(count / 20.0);

        for (var page = 1; page <= pages; page++)
        {
            var topRated = await _tmdbService.GetTopRatedMovies(page);
            if (topRated == null || topRated.Results.Count == 0)
            {
                break;
            }

            tmdbIds.AddRange(topRated.Results.Select(m => m.Id));
            await Task.Delay(120);
        }

        var imported = 0;

        foreach (var tmdbId in tmdbIds.Distinct().Take(count))
        {
            var media = await ImportMediaFromTmdb(tmdbId, userId);
            if (media != null)
            {
                imported++;
            }

            await Task.Delay(80);
        }

        return imported;
    }

    public async Task<int> SeedByCategories(int perGenre, int userId)
    {
        var genres = await _context.Genres.ToListAsync();
        var tmdbIds = new HashSet<int>();

        foreach (var genre in genres)
        {
            var existingCount = await _context.MediaGenres.CountAsync(mg => mg.GenreId == genre.Id);
            if (existingCount >= perGenre)
            {
                continue;
            }

            var collected = 0;
            var page = 1;
            var consecutiveFailures = 0;

            while (collected < perGenre && page <= 10 && consecutiveFailures < 3)
            {
                var discover = await _tmdbService.DiscoverMoviesByGenre(genre.TmdbId, page);

                if (discover == null)
                {
                    consecutiveFailures++;
                    await Task.Delay(500);
                    continue;
                }

                consecutiveFailures = 0;

                if (discover.Results.Count == 0)
                {
                    break;
                }

                foreach (var movie in discover.Results)
                {
                    tmdbIds.Add(movie.Id);
                }

                collected += discover.Results.Count;
                page++;

                await Task.Delay(120);
            }
        }

        var imported = 0;

        foreach (var tmdbId in tmdbIds)
        {
            var media = await ImportMediaFromTmdb(tmdbId, userId);
            if (media != null)
            {
                imported++;
            }

            await Task.Delay(80);
        }

        return imported;
    }

    // FAVORITES
    public async Task AddFavorite(int mediaId, int userId)
    {
        var exists = await _context.Favorites.AnyAsync(f =>
            f.UserId == userId &&
            f.MediaId == mediaId);

        if (exists)
        {
            return;
        }

        var favorite = new Favorite
        {
            UserId = userId,
            MediaId = mediaId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
    }
    public async Task<bool> RemoveFavorite(int mediaId, int userId)
    {
        var favorite = await _context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.MediaId == mediaId);
        if (favorite == null)
        {
            return false;
        }

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<List<MediaListDto>> GetMyFavorites(int userId)
    {
        var medias = await _context.Favorites
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => f.Media)
            .ToListAsync();

        return _mapper.Map<List<MediaListDto>>(medias);
    }

    // REVIEW
    public async Task CreateReview(int mediaId, int userId, CreateReviewDto dto)
    {
        var mediaExists = await _context.Media.AnyAsync(m => m.Id == mediaId);

        if (!mediaExists)
        {
            throw new KeyNotFoundException("Media not found.");
        }

        var exists = await _context.Reviews.AnyAsync(r =>
            r.UserId == userId &&
            r.MediaId == mediaId);

        if (exists)
        {
            throw new InvalidOperationException("You've already commented on this movie.");
        }

        var review = new Review
        {
            UserId = userId,
            MediaId = mediaId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();
    }
    public async Task<List<ReviewDto>> GetReviews(int mediaId)
    {
        return await _context.Reviews
            .Where(r => r.MediaId == mediaId)
            .Include(r => r.User)
            .ProjectTo<ReviewDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

    }
    public async Task UpdateReview(int reviewId, int userId, CreateReviewDto dto)
    {
        var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null)
        {
            throw new KeyNotFoundException("Review not found.");
        }

        if (review.UserId != userId)
        {
            throw new UnauthorizedAccessException("You can only change your own review.");
        }

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;
        review.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }
    public async Task DeleteReview(int reviewId, int userId)
    {
        var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null)
        {
            throw new KeyNotFoundException("Review not found.");
        }

        if (review.UserId != userId)
        {
            throw new UnauthorizedAccessException("You can only delete your own review.");
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
    }

    // WATCHLIST
    public async Task AddToWatchlist(int mediaId, int userId)
    {
        var mediaExists = await _context.Media.AnyAsync(m => m.Id == mediaId);

        if (!mediaExists)
        {
            throw new KeyNotFoundException("Media not found.");
        }

        var exists = await _context.Watchlists.AnyAsync(w => w.UserId == userId && w.MediaId == mediaId);

        if (exists)
        {
            throw new InvalidOperationException("This movie is already on your list.");
        }

        var watchlist = new Watchlist
        {
            UserId = userId,
            MediaId = mediaId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Watchlists.Add(watchlist);
        await _context.SaveChangesAsync();
    }
    public async Task RemoveFromWatchlist(int mediaId, int userId)
    {
        var watchlist = await _context.Watchlists.FirstOrDefaultAsync(w => w.UserId == userId && w.MediaId == mediaId);

        if (watchlist == null)
        {
            throw new KeyNotFoundException("Watchlist not found.");
        }

        _context.Watchlists.Remove(watchlist);
        await _context.SaveChangesAsync();
    }
    public async Task<List<MediaCardDto>> GetMyWatchlist(int userId)
    {
        return await _context.Watchlists
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.CreatedAt)
            .Select(w => w.Media)
            .ProjectTo<MediaCardDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    // WATCHED
    public async Task AddToWatched(int mediaId, int userId)
    {
        var mediaExists = await _context.Media.AnyAsync(m => m.Id == mediaId);

        if (!mediaExists)
        {
            throw new KeyNotFoundException("Media not found.");
        }

        var exists = await _context.WatchedMedias
            .AnyAsync(w => w.UserId == userId && w.MediaId == mediaId);

        if (exists)
        {
            throw new InvalidOperationException("This media is already marked as watched.");
        }

        var watched = new WatchedMedia
        {
            UserId = userId,
            MediaId = mediaId,
            WatchedAt = DateTime.UtcNow
        };

        _context.WatchedMedias.Add(watched);

        await _context.SaveChangesAsync();
    }
    public async Task RemoveFromWatched(int mediaId, int userId)
    {
        var watched = await _context.WatchedMedias
            .FirstOrDefaultAsync(w =>
                w.UserId == userId &&
                w.MediaId == mediaId);

        if (watched == null)
        {
            throw new KeyNotFoundException("Watched record not found.");
        }

        _context.WatchedMedias.Remove(watched);

        await _context.SaveChangesAsync();
    }
    public async Task<List<WatchedMediaDto>> GetMyWatched(int userId)
    {
        return await _context.WatchedMedias
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.WatchedAt)
            .Select(w => new WatchedMediaDto
            {
                Id = w.Media.Id,
                Title = w.Media.Title,
                PosterPath = w.Media.PosterPath,
                ReleaseYear = w.Media.ReleaseDate == DateOnly.MinValue ? null : (int?)w.Media.ReleaseDate.Year,
                AverageRating = w.Media.Rating,
                WatchedAt = w.WatchedAt
            })
            .ToListAsync();
    }

}
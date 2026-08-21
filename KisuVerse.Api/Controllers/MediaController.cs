using Microsoft.AspNetCore.Mvc;
using KisuVerse.Api.Services;
using KisuVerse.Api.Models;
using KisuVerse.Api.Dtos.Media;
using KisuVerse.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using KisuVerse.Api.Dtos.Review;
using KisuVerse.Api.Dtos.Common;

namespace KisuVerse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MediaController : ControllerBase
{
    private readonly IMediaService _mediaService;
    private readonly TmdbService _tmdbService;

    public MediaController(IMediaService mediaService, TmdbService tmdbService)
    {
        _mediaService = mediaService;
        _tmdbService = tmdbService;
    }

    [Authorize]
    [HttpGet("test-auth")]
    public IActionResult TestAuth()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return Ok(new
        {
            message = "Token çalışıyor",
            userId
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var media = await _mediaService.GetAllMedia();
        return Ok(media);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        int? userId = null;
        if (User.Identity?.IsAuthenticated == true)
        {
            userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        }

        var media = await _mediaService.GetMediaById(id, userId);
        if (media == null)
        {
            return NotFound();
        }
        return Ok(media);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchAsync([FromQuery] SearchRequestDto dto)
    {
        var result = await _mediaService.SearchAsync(dto);

        return Ok(result);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateMediaDto dto)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        try
        {
            var media = await _mediaService.UpdateMedia(id, dto, userId);

            if (media == null)
            {
                return NotFound();
            }

            return Ok(media);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );
        try
        {
            var deleted = await _mediaService.DeleteMedia(id, userId);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create(CreateMediaDto dto)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var createdMedia = await _mediaService.AddMedia(dto, userId);

        return Ok(createdMedia);
    }

    [HttpGet("tmdb-test")]
    public async Task<IActionResult> TmdbTest()
    {
        var movie = await _tmdbService.TestConnection();

        return Ok(movie);
    }

    [Authorize]
    [HttpPost("tmdb-import/{tmdbId}")]
    public async Task<IActionResult> ImportFromTmdb(int tmdbId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );
        var media = await _mediaService.ImportMediaFromTmdb(tmdbId, userId);
        if (media == null)
        {
            return NotFound();
        }
        return Ok(media);
    }

    [HttpGet("tmdb-search")]
    public async Task<IActionResult> SearchTmdb([FromQuery] string query)
    {
        var movies = await _tmdbService.SearchMovies(query);

        if (movies == null)
        {
            return BadRequest();
        }

        return Ok(movies);
    }

    [HttpGet("tmdb-detail/{id}")]
    public async Task<IActionResult> GetTmdbDetail(int id)
    {
        var movie = await _tmdbService.GetMovieDetails(id);

        if (movie == null)
        {
            return NotFound();
        }

        return Ok(movie);
    }

    [HttpGet("tmdb-credits/{id}")]
    public async Task<IActionResult> GetTmdbCredits(int id)
    {
        var credits = await _tmdbService.GetMovieCredits(id);

        if (credits == null)
        {
            return NotFound();
        }

        return Ok(credits);
    }

    [HttpGet("{id}/similar")]
    public async Task<IActionResult> GetSimilarMovies(int id)
    {
        var similarMovies = await _mediaService.GetSimilarMovies(id);

        return Ok(similarMovies);
    }

    [Authorize]
    [HttpPost("seed")]
    public async Task<IActionResult> SeedPopularMovies([FromQuery] int pages = 3)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var imported = await _mediaService.SeedPopularMovies(pages, userId);

        return Ok(new { imported });
    }

    [Authorize]
    [HttpPost("seed-top-rated")]
    public async Task<IActionResult> SeedTopRatedMovies([FromQuery] int count = 200)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var imported = await _mediaService.SeedTopRatedMovies(count, userId);

        return Ok(new { imported });
    }

    [Authorize]
    [HttpPost("seed-categories")]
    public async Task<IActionResult> SeedByCategories([FromQuery] int perGenre = 50)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var imported = await _mediaService.SeedByCategories(perGenre, userId);

        return Ok(new { imported });
    }

    [HttpGet("genres")]
    public async Task<IActionResult> GetGenres()
    {
        var genres = await _mediaService.GetGenres();
        return Ok(genres);
    }

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending([FromQuery] int take = 10, [FromQuery] int? genreId = null)
    {
        var trending = await _mediaService.GetTrending(take, genreId);
        return Ok(trending);
    }

    [Authorize]
    [HttpGet("by-genre/{genreId}")]
    public async Task<IActionResult> GetByGenre(int genreId, [FromQuery] int page = 1)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var movies = await _mediaService.GetMoviesByGenre(genreId, page, userId);

        return Ok(movies);
    }

    // FAVORITE

    [Authorize]
    [HttpPost("{mediaId}/favorite")]
    public async Task<IActionResult> AddFavorite(int mediaId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        await _mediaService.AddFavorite(mediaId, userId);

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{mediaId}/favorite")]
    public async Task<IActionResult> RemoveFavorite(int mediaId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );


        var deleted = await _mediaService.RemoveFavorite(mediaId, userId);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }

    [Authorize]
    [HttpGet("myfavs")]
    public async Task<IActionResult> GetMyFavorites()
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var favorites = await _mediaService.GetMyFavorites(userId);

        return Ok(favorites);
    }

    // REVIEW
}
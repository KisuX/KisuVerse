using System.Security.Claims;
using KisuVerse.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KisuVerse.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/watchlist")]

public class WatchlistController : ControllerBase
{
    private readonly IMediaService _mediaService;

    public WatchlistController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpPost("{mediaId}")]
    public async Task<IActionResult> AddToWatchlist(int mediaId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        await _mediaService.AddToWatchlist(mediaId, userId);

        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetMyWatchlist()
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var watchlists = await _mediaService.GetMyWatchlist(userId);

        return Ok(watchlists);
    }

    [HttpDelete("{mediaId}")]
    public async Task<IActionResult> RemoveFromWatchlist(int mediaId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        await _mediaService.RemoveFromWatchlist(mediaId, userId);


        return NoContent();
    }


}
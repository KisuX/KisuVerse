using System.Security.Claims;
using KisuVerse.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KisuVerse.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class WatchedController : ControllerBase
{
    private readonly IMediaService _mediaService;

    public WatchedController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpPost("{mediaId}")]
    public async Task<IActionResult> AddToWatched(int mediaId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        await _mediaService.AddToWatched(mediaId, userId);

        return NoContent();
    }

    [HttpGet("mywatched")]
    public async Task<IActionResult> GetMyWatched()
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        var watched = await _mediaService.GetMyWatched(userId);

        return Ok(watched);
    }

    [HttpDelete("{mediaId}")]
    public async Task<IActionResult> RemoveFromWatched(int mediaId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        await _mediaService.RemoveFromWatched(mediaId, userId);

        return NoContent();
    }
}
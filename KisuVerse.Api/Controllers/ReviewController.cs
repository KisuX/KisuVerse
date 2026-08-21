using System.Security.Claims;
using KisuVerse.Api.Dtos.Review;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KisuVerse.Api.Services.Interfaces;
using KisuVerse.Api.Services;

namespace KisuVerse.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/reviews")]

public class ReviewController : ControllerBase
{
    private readonly IMediaService _mediaService;

    public ReviewController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }


    [HttpPost("{mediaId}")]
    public async Task<IActionResult> CreateReview(int mediaId, CreateReviewDto dto)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        await _mediaService.CreateReview(mediaId, userId, dto);

        return NoContent();
    }

    [AllowAnonymous]
    [HttpGet("{mediaId}")]
    public async Task<IActionResult> GetReviews(int mediaId)
    {

        var reviews = await _mediaService.GetReviews(mediaId);

        return Ok(reviews);
    }

    [HttpPut("{reviewId}")]
    public async Task<IActionResult> UpdateReview(int reviewId, CreateReviewDto dto)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        await _mediaService.UpdateReview(reviewId, userId, dto);

        return NoContent();
    }

    [HttpDelete("{reviewId}")]
    public async Task<IActionResult> DeleteReview(int reviewId)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value
        );

        await _mediaService.DeleteReview(reviewId, userId);

        return NoContent();
    }
}
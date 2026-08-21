using KisuVerse.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KisuVerse.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _adminService.GetStats();
        return Ok(stats);
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _adminService.GetUsers();
        return Ok(users);
    }

    [HttpGet("reviews")]
    public async Task<IActionResult> GetAllReviews()
    {
        var reviews = await _adminService.GetAllReviews();
        return Ok(reviews);
    }

    [HttpDelete("reviews/{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var deleted = await _adminService.DeleteReview(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpDelete("media/{id}")]
    public async Task<IActionResult> DeleteMedia(int id)
    {
        var deleted = await _adminService.DeleteMedia(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}

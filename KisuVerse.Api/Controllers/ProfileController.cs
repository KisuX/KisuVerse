using System.Security.Claims;
using KisuVerse.Api.Data;
using KisuVerse.Api.Dtos.Auth;
using KisuVerse.Api.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KisuVerse.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _context;

    public ProfileController(UserManager<ApplicationUser> userManager, AppDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        var user = await _userManager.FindByIdAsync(CurrentUserId.ToString());
        if (user == null)
        {
            return NotFound();
        }

        var userId = CurrentUserId;

        var profile = new ProfileDto
        {
            DisplayName = user.DisplayName,
            Email = user.Email ?? string.Empty,
            CreatedAt = user.CreatedAt,
            WatchedCount = await _context.WatchedMedias.CountAsync(w => w.UserId == userId),
            FavoriteCount = await _context.Favorites.CountAsync(f => f.UserId == userId),
            WatchlistCount = await _context.Watchlists.CountAsync(w => w.UserId == userId),
            ReviewCount = await _context.Reviews.CountAsync(r => r.UserId == userId)
        };

        return Ok(profile);
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
        var user = await _userManager.FindByIdAsync(CurrentUserId.ToString());
        if (user == null)
        {
            return NotFound();
        }

        var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(errors);
        }

        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteAccount()
    {
        var user = await _userManager.FindByIdAsync(CurrentUserId.ToString());
        if (user == null)
        {
            return NotFound();
        }

        var hasCreatedMedia = await _context.Media.AnyAsync(m => m.CreatedByUserId == CurrentUserId);
        if (hasCreatedMedia)
        {
            return Conflict("This account cannot be deleted because it has added movies to the catalog.");
        }

        await _userManager.DeleteAsync(user);
        return NoContent();
    }
}

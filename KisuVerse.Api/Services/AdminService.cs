using KisuVerse.Api.Data;
using KisuVerse.Api.Dtos.Admin;
using KisuVerse.Api.Models.Identity;
using KisuVerse.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace KisuVerse.Api.Services;

public class AdminService : IAdminService
{
    private readonly AppDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminService(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<AdminStatsDto> GetStats()
    {
        return new AdminStatsDto
        {
            TotalUsers = await _context.Users.CountAsync(),
            TotalMovies = await _context.Media.CountAsync(),
            TotalReviews = await _context.Reviews.CountAsync(),
            TotalWatched = await _context.WatchedMedias.CountAsync(),
            TotalFavorites = await _context.Favorites.CountAsync(),
            TotalWatchlist = await _context.Watchlists.CountAsync()
        };
    }

    public async Task<List<AdminUserDto>> GetUsers()
    {
        var users = await _context.Users.OrderByDescending(u => u.CreatedAt).ToListAsync();
        var result = new List<AdminUserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            result.Add(new AdminUserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                CreatedAt = user.CreatedAt,
                Roles = roles.ToList()
            });
        }

        return result;
    }

    public async Task<List<AdminReviewDto>> GetAllReviews()
    {
        return await _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Media)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new AdminReviewDto
            {
                Id = r.Id,
                MediaId = r.MediaId,
                MediaTitle = r.Media.Title,
                DisplayName = r.User.DisplayName,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<bool> DeleteReview(int reviewId)
    {
        var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null)
        {
            return false;
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteMedia(int mediaId)
    {
        var media = await _context.Media.FirstOrDefaultAsync(m => m.Id == mediaId);
        if (media == null)
        {
            return false;
        }

        _context.Media.Remove(media);
        await _context.SaveChangesAsync();
        return true;
    }
}

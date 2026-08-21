using KisuVerse.Api.Dtos.Admin;

namespace KisuVerse.Api.Services.Interfaces;

public interface IAdminService
{
    Task<AdminStatsDto> GetStats();
    Task<List<AdminUserDto>> GetUsers();
    Task<List<AdminReviewDto>> GetAllReviews();
    Task<bool> DeleteReview(int reviewId);
    Task<bool> DeleteMedia(int mediaId);
}

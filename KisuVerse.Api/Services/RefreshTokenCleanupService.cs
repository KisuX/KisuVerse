using KisuVerse.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace KisuVerse.Api.Services;

public class RefreshTokenCleanupService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<RefreshTokenCleanupService> _logger;
    private readonly TimeSpan _interval = TimeSpan.FromHours(24);

    public RefreshTokenCleanupService(IServiceScopeFactory scopeFactory, ILogger<RefreshTokenCleanupService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var oldtokens = context.RefreshTokens
                    .Where(rt => rt.IsRevoked || rt.ExpiresAt < DateTime.UtcNow);

                context.RefreshTokens.RemoveRange(oldtokens);
                var deletedCount = await context.SaveChangesAsync(stoppingToken);

                _logger.LogInformation("Refresh token cleanup: {Count} kayıt silindi.", deletedCount);
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }
}
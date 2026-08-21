using Microsoft.EntityFrameworkCore;
using KisuVerse.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using KisuVerse.Api.Models.Identity;
using Microsoft.AspNetCore.Identity;

namespace KisuVerse.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Media> Media { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Person> People { get; set; }
    public DbSet<MediaPerson> MediaPeople { get; set; }
    public DbSet<MediaGenre> MediaGenres { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Watchlist> Watchlists { get; set; }
    public DbSet<WatchedMedia> WatchedMedias { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<MediaGenre>()
            .HasKey(mg => new { mg.MediaId, mg.GenreId });

        modelBuilder.Entity<MediaGenre>()
            .HasOne(mg => mg.Media)
            .WithMany(m => m.MediaGenres)
            .HasForeignKey(mg => mg.MediaId);

        modelBuilder.Entity<MediaGenre>()
            .HasOne(mg => mg.Genre)
            .WithMany(g => g.MediaGenres)
            .HasForeignKey(mg => mg.GenreId);

        modelBuilder.Entity<Genre>().HasData(
            new Genre { Id = 1, TmdbId = 28, Name = "Action" },
            new Genre { Id = 2, TmdbId = 12, Name = "Adventure" },
            new Genre { Id = 3, TmdbId = 16, Name = "Animation" },
            new Genre { Id = 4, TmdbId = 35, Name = "Comedy" },
            new Genre { Id = 5, TmdbId = 80, Name = "Crime" },
            new Genre { Id = 6, TmdbId = 99, Name = "Documentary" },
            new Genre { Id = 7, TmdbId = 18, Name = "Drama" },
            new Genre { Id = 8, TmdbId = 10751, Name = "Family" },
            new Genre { Id = 9, TmdbId = 14, Name = "Fantasy" },
            new Genre { Id = 10, TmdbId = 36, Name = "History" },
            new Genre { Id = 11, TmdbId = 27, Name = "Horror" },
            new Genre { Id = 12, TmdbId = 10402, Name = "Music" },
            new Genre { Id = 13, TmdbId = 9648, Name = "Mystery" },
            new Genre { Id = 14, TmdbId = 10749, Name = "Romance" },
            new Genre { Id = 15, TmdbId = 878, Name = "Science Fiction" },
            new Genre { Id = 16, TmdbId = 10770, Name = "TV Movie" },
            new Genre { Id = 17, TmdbId = 53, Name = "Thriller" },
            new Genre { Id = 18, TmdbId = 10752, Name = "War" },
            new Genre { Id = 19, TmdbId = 37, Name = "Western" }
            );

        modelBuilder.Entity<MediaPerson>()
            .HasOne(mp => mp.Person)
            .WithMany(p => p.MediaPeople)
            .HasForeignKey(mp => mp.PersonId);

        modelBuilder.Entity<MediaPerson>()
            .HasOne(mp => mp.Media)
            .WithMany(m => m.MediaPeople)
            .HasForeignKey(mp => mp.MediaId);

        modelBuilder.Entity<Person>()
            .HasIndex(p => p.TmdbId)
            .IsUnique();

        modelBuilder.Entity<Media>()
            .HasOne(m => m.CreatedByUser)
            .WithMany()
            .HasForeignKey(m => m.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Favorite>()
            .HasIndex(f => new { f.UserId, f.MediaId })
            .IsUnique();

        modelBuilder.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
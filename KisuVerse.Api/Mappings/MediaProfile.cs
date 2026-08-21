using AutoMapper;
using KisuVerse.Api.Models;
using KisuVerse.Api.Dtos.Media;
using KisuVerse.Api.Dtos.Person;
using KisuVerse.Api.Dtos.Tmdb;

namespace KisuVerse.Api.Mappings;

public class MediaProfile : Profile
{
    public MediaProfile()
    {
        CreateMap<MediaPerson, MediaCastDto>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Person.Id))
            .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Person.Name))
            .ForMember(d => d.ProfileImagePath, opt => opt.MapFrom(s => s.Person.ProfileImagePath))
            .ForMember(d => d.Character, opt => opt.MapFrom(s => s.Character))
            .ForMember(d => d.Order, opt => opt.MapFrom(s => s.Order));

        CreateMap<MediaPerson, MediaCrewDto>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Person.Id))
            .ForMember(d => d.Name, opt => opt.MapFrom(s => s.Person.Name))
            .ForMember(d => d.ProfileImagePath, opt => opt.MapFrom(s => s.Person.ProfileImagePath))
            .ForMember(d => d.Job, opt => opt.MapFrom(s => s.Job))
            .ForMember(d => d.Department, opt => opt.MapFrom(s => s.Department));

        CreateMap<MediaPerson, PersonMovieDto>()
            .ForMember(d => d.MediaId, opt => opt.MapFrom(s => s.Media.Id))
            .ForMember(d => d.Title, opt => opt.MapFrom(s => s.Media.Title))
            .ForMember(d => d.PosterUrl, opt => opt.MapFrom(s => s.Media.PosterPath))
            .ForMember(d => d.Character, opt => opt.MapFrom(s => s.Character))
            .ForMember(d => d.Job, opt => opt.MapFrom(s => s.Job))
            .ForMember(d => d.Department, opt => opt.MapFrom(s => s.Department))
            .ForMember(d => d.ReleaseDate, opt => opt.MapFrom(s => s.Media.ReleaseDate))
            .ForMember(d => d.AverageRating, opt => opt.MapFrom(s => s.Media.Rating))
            .ForMember(d => d.PosterUrl,
                opt => opt.MapFrom(s =>
                    string.IsNullOrEmpty(s.Media.PosterPath)
                        ? string.Empty
                        : $"https://image.tmdb.org/t/p/original{s.Media.PosterPath}"));

        CreateMap<CreateMediaDto, Media>();

        CreateMap<UpdateMediaDto, Media>();

        CreateMap<Media, MediaListDto>()
            .ForMember(d => d.Genres, opt => opt.MapFrom(s => s.MediaGenres.Select(mg => mg.Genre.Name).ToList()))
            .ForMember(d => d.CreatedByUserEmail, opt => opt.MapFrom(s => s.CreatedByUser.Email))
            .ForMember(d => d.PosterUrl,
                opt => opt.MapFrom(s =>
                    string.IsNullOrEmpty(s.PosterPath)
                        ? string.Empty
                        : $"https://image.tmdb.org/t/p/original{s.PosterPath}"));

        CreateMap<Media, MediaDetailDto>()
            .ForMember(d => d.Genres,
                opt => opt.MapFrom(s => s.MediaGenres
                .Select(mg => mg.Genre.Name)
                .ToList()))
            .ForMember(d => d.Cast,
                opt => opt.MapFrom(s => s.MediaPeople
                    .Where(mp => mp.Department == "Acting")
                    .OrderBy(mp => mp.Order)
                    .Take(10)))
            .ForMember(d => d.Crew,
                opt => opt.MapFrom(s => s.MediaPeople
                    .Where(mp => mp.Department != "Acting")))
            .ForMember(d => d.PosterUrl,
                opt => opt.MapFrom(s =>
                    string.IsNullOrEmpty(s.PosterPath)
                        ? string.Empty
                        : $"https://image.tmdb.org/t/p/original{s.PosterPath}"))
            .ForMember(d => d.BackdropUrl,
                opt => opt.MapFrom(s =>
                    string.IsNullOrEmpty(s.BackdropPath)
                        ? string.Empty
                        : $"https://image.tmdb.org/t/p/original{s.BackdropPath}"));

        CreateMap<Media, MediaSearchDto>();

        CreateMap<TmdbMovieDto, MediaSearchDto>()
            .ForMember(d => d.PosterUrl, opt => opt.MapFrom(s =>
                string.IsNullOrEmpty(s.PosterPath)
                    ? string.Empty
                    : $"https://image.tmdb.org/t/p/original{s.PosterPath}"))
            .ForMember(d => d.Rating, opt => opt.MapFrom(s => s.VoteAverage));

        CreateMap<Media, MediaCardDto>()
            .ForMember(d => d.ReleaseYear,
                opt => opt.MapFrom(s => s.ReleaseDate == DateOnly.MinValue ? (int?)null : s.ReleaseDate.Year))
            .ForMember(d => d.AverageRating,
                opt => opt.MapFrom(s => s.Rating));
    }
}
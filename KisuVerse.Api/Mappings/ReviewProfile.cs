using AutoMapper;
using KisuVerse.Api.Dtos.Review;
using KisuVerse.Api.Models;

namespace KisuVerse.Api.Mappings;

public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        CreateMap<Review, ReviewDto>()
            .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.User.DisplayName));
    }
}

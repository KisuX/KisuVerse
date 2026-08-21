
using AutoMapper;
using KisuVerse.Api.Dtos.Person;
using KisuVerse.Api.Models;

namespace KisuVerse.Api.Mappings;

public class PersonProfile : Profile
{
    public PersonProfile()
    {
        CreateMap<Person, PersonListDto>();

        CreateMap<Person, PersonDetailDto>()
            .ForMember(d => d.Movies, opt => opt.MapFrom(s => s.MediaPeople));

        CreateMap<Person, PersonSearchDto>();
    }

}
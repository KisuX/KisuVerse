using KisuVerse.Api.Dtos.Person;

namespace KisuVerse.Api.Services.Interfaces;

public interface IPersonService
{
    Task<List<PersonListDto>> GetAllPeople();

    Task<PersonDetailDto?> GetPersonById(int id);

    Task<List<PersonSearchDto>> SearchAsync(string query);

    Task<PersonDetailDto?> ImportPersonFromTmdb(int tmdbId);

}
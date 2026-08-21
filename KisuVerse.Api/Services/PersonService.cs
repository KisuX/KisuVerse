using AutoMapper;
using AutoMapper.QueryableExtensions;
using KisuVerse.Api.Data;
using KisuVerse.Api.Dtos.Person;
using KisuVerse.Api.Models;
using KisuVerse.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace KisuVerse.Api.Services;

public class PersonService : IPersonService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly TmdbService _tmdbService;

    public PersonService(AppDbContext context, IMapper mapper, TmdbService tmdbService)
    {
        _context = context;
        _mapper = mapper;
        _tmdbService = tmdbService;
    }

    public async Task<List<PersonListDto>> GetAllPeople()
    {
        return await _context.People
        .ProjectTo<PersonListDto>(_mapper.ConfigurationProvider)
        .ToListAsync();
    }

    public async Task<PersonDetailDto?> GetPersonById(int id)
    {
        var person = await _context.People.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        if (person == null)
        {
            return null;
        }

        if (string.IsNullOrEmpty(person.Biography) && person.TmdbId > 0)
        {
            await ImportPersonFromTmdb(person.TmdbId);
        }

        return await _context.People
            .ProjectTo<PersonDetailDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<PersonSearchDto>> SearchAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<PersonSearchDto>();
        }

        var people = await _context.People
            .AsNoTracking()
            .Where(m => m.Name.Contains(query))
            .OrderBy(m => m.Name)
            .ToListAsync();

        var personDtos = _mapper.Map<List<PersonSearchDto>>(people);

        return personDtos;
    }

    public async Task<PersonDetailDto?> ImportPersonFromTmdb(int tmdbId)
    {
        if (tmdbId <= 0)
        {
            return null;
        }

        var person = await _tmdbService.GetPersonDetails(tmdbId);

        if (person == null)
        {
            return null;
        }

        var targetPerson = _context.People.Local.FirstOrDefault(x => x.TmdbId == tmdbId)
            ?? await _context.People.FirstOrDefaultAsync(x => x.TmdbId == tmdbId);

        if (targetPerson == null)
        {
            targetPerson = new Person
            {
                TmdbId = person.Id
            };
            _context.People.Add(targetPerson);
        }

        DateOnly? birthday = null;
        if (DateOnly.TryParse(person.Birthday, out var parsedBirthday))
        {
            birthday = parsedBirthday;
        }

        DateOnly? deathDay = null;
        if (DateOnly.TryParse(person.DeathDay, out var parsedDeathDay))
        {
            deathDay = parsedDeathDay;
        }

        targetPerson.Name = person.Name;
        targetPerson.ProfileImagePath = person.ProfileImagePath;
        targetPerson.Popularity = person.Popularity;
        targetPerson.Biography = person.Biography;
        targetPerson.PlaceOfBirth = person.PlaceOfBirth;
        targetPerson.KnownForDepartment = person.KnownForDepartment;
        targetPerson.Birthday = birthday;
        targetPerson.DeathDay = deathDay;

        await _context.SaveChangesAsync();

        return _mapper.Map<PersonDetailDto>(targetPerson);
    }
}
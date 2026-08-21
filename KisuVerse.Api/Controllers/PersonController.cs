using KisuVerse.Api.Dtos.Person;
using KisuVerse.Api.Models;
using KisuVerse.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace KisuVerse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class PersonController : ControllerBase
{
    private readonly IPersonService _personService;

    public PersonController(IPersonService personService)
    {
        _personService = personService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPeople()
    {
        var people = await _personService.GetAllPeople();
        return Ok(people);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPersonById(int id)
    {
        var person = await _personService.GetPersonById(id);
        if (person == null)
        {
            return NotFound();
        }
        return Ok(person);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(string query)
    {
        var people = await _personService.SearchAsync(query);
        return Ok(people);
    }

    [HttpPost("tmdb-import/{tmdbId}")]
    public async Task<IActionResult> ImportFromTmdb(int tmdbId)
    {
        var person = await _personService.ImportPersonFromTmdb(tmdbId);

        if (person == null)
        {
            return NotFound();
        }

        return Ok(person);
    }


}
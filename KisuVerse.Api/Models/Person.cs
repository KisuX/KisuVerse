namespace KisuVerse.Api.Models;

public class Person
{
    public int Id { get; set; }
    public int TmdbId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ProfileImagePath { get; set; }
    public DateOnly? Birthday { get; set; }
    public double Popularity { get; set; }
    public string? Biography { get; set; }
    public string? PlaceOfBirth { get; set; }
    public DateOnly? DeathDay { get; set; }
    public string? KnownForDepartment { get; set; }
    public ICollection<MediaPerson> MediaPeople { get; set; }
        = new List<MediaPerson>();
}
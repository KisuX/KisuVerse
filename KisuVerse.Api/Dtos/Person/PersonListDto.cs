namespace KisuVerse.Api.Dtos.Person;

public class PersonListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ProfileImagePath { get; set; }
    public DateOnly? Birthday { get; set; }
    public double Popularity { get; set; }
    public string? KnownForDepartment { get; set; }
}
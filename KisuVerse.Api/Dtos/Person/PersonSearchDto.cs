namespace KisuVerse.Api.Dtos.Person;

public class PersonSearchDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ProfileImagePath { get; set; }
    public string? KnownForDepartment { get; set; }
}
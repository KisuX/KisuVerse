
namespace KisuVerse.Api.Dtos.Media;

public class MediaCrewDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ProfileImagePath { get; set; }
    public string Job { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
}
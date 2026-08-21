
namespace KisuVerse.Api.Dtos.Media;

public class MediaCastDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ProfileImagePath { get; set; }
    public string Character { get; set; } = string.Empty;
    public int Order { get; set; }
}
namespace KisuVerse.Api.Models;

public class MediaPerson
{
    public int Id { get; set; }

    public int MediaId { get; set; }
    public Media Media { get; set; } = null!;

    public int PersonId { get; set; }
    public Person Person { get; set; } = null!;

    public string Department { get; set; } = string.Empty;

    public string? Job { get; set; }

    public string? Character { get; set; }

    public int Order { get; set; }
}
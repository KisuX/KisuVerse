namespace KisuVerse.Api.Dtos.Admin;

public class AdminReviewDto
{
    public int Id { get; set; }
    public int MediaId { get; set; }
    public string MediaTitle { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

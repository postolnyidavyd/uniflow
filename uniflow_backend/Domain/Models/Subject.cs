namespace Domain.Models;

public class Subject
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Lecturer { get; set; }

    public string? MarkdownContent { get; set; }
    public DateTime LastUpdatedAt { get; set; }
    
    //Не знаю як будуть зберігатися зображення але можливо Cloudinary
    public string? ImgUrl { get; set; }
    
    public Guid CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
    
    public ICollection<Event> Events { get; set; } = new List<Event>();
    public ICollection<QueueSession> QueueSessions { get; set; } = new List<QueueSession>();
}
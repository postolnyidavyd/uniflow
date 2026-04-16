namespace DTOs.QueueDTOs;

public class QueueStateResponseDto
{
    public IEnumerable<QueueEntryDto> Entries { get; set; }
    public QueueEntryDto? UserEntry {get; set; }
}
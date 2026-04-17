using DTOs.EventDTOs;
using DTOs.QueueDTOs;

namespace DTOs.CalendarDTOs;

public class UpcomingDashboardDto
{
    public IEnumerable<EventShortResponseDto> Deadlines { get; set; } = new List<EventShortResponseDto>();
    public IEnumerable<EventShortResponseDto> Events { get; set; } = new List<EventShortResponseDto>();
    public IEnumerable<QueueSessionShortResponseDto> Queues { get; set; } = new List<QueueSessionShortResponseDto>();
}
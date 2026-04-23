using DTOs.QueueDTOs;

namespace Hubs.Clients;

public interface IQueueClient
{
    Task SessionDetailUpdated(QueueSessionDetailResponseDto details);
    Task QueueEntriesUpdated(IEnumerable<QueueEntryDto> entries);
}
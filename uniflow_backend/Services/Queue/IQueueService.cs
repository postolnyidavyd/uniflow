using DTOs.QueueDTOs;

namespace Services.Queue;

public interface IQueueService
{
    Task<QueueSessionDetailResponseDto> GetSessionByIdAsync( Guid userId, Guid sessionId);
    Task<QueueStateResponseDto> GetSessionEntriesAsync(Guid userId, Guid sessionId);
    
    //Crud операції
    Task CreateSessionAsync(Guid userId, CreateQueueSessionDto dto);
    Task UpdateSessionAsync(Guid sessionId, UpdateQueueSessionDto dto);
    Task DeleteSessionAsync(Guid sessionId);
    
    //Методи для Hangfire
    Task AutoOpenSessionRegistrationAsync(Guid sessionId);
    Task AutoActivateSessionAsync(Guid sessionId);
    Task AutoCloseSessionAsync(Guid sessionId);
    
    //Методи юзера
    Task JoinSessionAsync(Guid userId, Guid sessionId, JoinQueueDto dto);
    Task LeaveSessionAsync(Guid userId, Guid sessionId);
    Task CompleteCurrentAsync(Guid userId, Guid sessionId);
    
    //Методи старости для черги
    Task SkipCurrentAsync(Guid sessionId);
    Task ForceCompleteCurrentAsync(Guid sessionId);
    
    //Методи для subject і calendar
    //Тут будуть братися найближчі до юзера, в яких він зареєстрований
    Task<IEnumerable<QueueSessionShortResponseDto>> GetUpcomingAsync(Guid userId, int take = 3);
    //Тут будуть братися найближчі до предмета, і якщо юзер зареєстрований, надає відповідну інформацію
    Task<IEnumerable<QueueSessionShortResponseDto>> GetUpcomingAsync(Guid userId, Guid subjectId, int take = 3);
    Task<IEnumerable<QueueSummaryResponseDto>> GetSessionByMonth(Guid userId, int year, int month);
}
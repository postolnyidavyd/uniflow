using System.Runtime.InteropServices.JavaScript;
using DataAccess.Data;
using Domain.Enums;
using Domain.Models;
using DTOs.QueueDTOs;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design.Internal;
using Services.Wallet;
using Services.WeightStrategyFactory;

namespace Services.Queue;

public class QueueService : IQueueService
{
    private readonly AppDbContext _appDbContext;
    private readonly IWalletService _walletService;
    private readonly IBackgroundJobClient _backgroundJobClient;
    private readonly IWeightStrategyFactory _weightStrategyFactory;

    public QueueService(AppDbContext appDbContext, IWalletService walletService,
        IBackgroundJobClient backgroundJobClient, IWeightStrategyFactory weightStrategyFactory)
    {
        _appDbContext = appDbContext;
        _walletService = walletService;
        _backgroundJobClient = backgroundJobClient;
        _weightStrategyFactory = weightStrategyFactory;
    }

    public async Task<QueueSessionDetailResponseDto> GetSessionByIdAsync(Guid userId, Guid sessionId)
    {
        return await _appDbContext.QueueSessions
                   .ProjectToSessionDetailDto()
                   .FirstOrDefaultAsync(q => q.Id == sessionId)
               ?? throw new KeyNotFoundException("Чергу не знайдено");
    }

    public async Task<QueueStateResponseDto> GetSessionEntriesAsync(Guid userId, Guid sessionId)
    {
        var entries = await _appDbContext.QueueEntries.Where(qn =>
                qn.QueueSessionId == sessionId && (qn.EntryStatus == QueueEntryStatus.Waiting ||
                                                   qn.EntryStatus == QueueEntryStatus.InProgress))
            .OrderByDescending(qn => qn.EffectiveWeight)
            .ThenBy(qn => qn.JoinedAt)
            .ProjectToDto()
            .ToListAsync();

        return new QueueStateResponseDto
        {
            Entries = entries,
            UserEntry = entries.FirstOrDefault(e => e.UserId == userId)
        };
    }

    public async Task CreateSessionAsync(Guid userId, CreateQueueSessionDto dto)
    {
        if (!await _appDbContext.Subjects.AnyAsync(s => s.Id == dto.SubjectId))
            throw new KeyNotFoundException("Предмет, до якого ви намагаєтесь додати чергу, не існує");

        var newSession = new QueueSession()
        {
            Title = dto.Title,
            ShortTitle = dto.ShortTitle,

            EventFormat = dto.EventFormat,
            Location = dto.Location,
            MeetUrl = dto.MeetUrl,

            RegistrationStartTime = dto.RegistrationStartTime,
            QueueStartTime = dto.QueueStartTime,

            Duration = TimeSpan.FromMinutes(dto.DurationMinutes),

            AverageMinutesPerStudent = dto.AverageMinutesPerStudent,

            //dto валідатор валідує що час реєстрації та початку буде більше рівне DateTime.UtcNow
            QueueStatus = QueueStatus.Planned,

            IsAllowedToSubmitMoreThanOne = dto.IsAllowedToSubmitMoreThanOne,
            SubmissionMode = dto.SubmissionMode ?? SubmissionMode.Single,

            SubjectId = dto.SubjectId,

            CreatedByUserId = userId,
        };
        await _appDbContext.QueueSessions.AddAsync(newSession);
        await _appDbContext.SaveChangesAsync();

        _backgroundJobClient.Schedule<IQueueService>(
            service => service.AutoOpenSessionRegistrationAsync(newSession.Id),
            newSession.RegistrationStartTime
        );
        _backgroundJobClient.Schedule<IQueueService>(
            service => service.AutoActivateSessionAsync(newSession.Id),
            newSession.QueueStartTime
        );

        //додатково година якщо викладач вирішить продовжити здачу після кінця пари
        var sessionEndTime = newSession.QueueStartTime.Add(newSession.Duration).AddHours(1);
        _backgroundJobClient.Schedule<IQueueService>(
            service => service.AutoCloseSessionAsync(newSession.Id),
            sessionEndTime
        );
    }

    public async Task UpdateSessionAsync(Guid sessionId, UpdateQueueSessionDto dto)
    {
        var session = await _appDbContext.QueueSessions.FindAsync(sessionId)
                      ?? throw new KeyNotFoundException("Чергу не знайдено");

        if (!string.IsNullOrWhiteSpace(dto.Title))
            session.Title = dto.Title;

        if (!string.IsNullOrWhiteSpace(dto.ShortTitle))
            session.ShortTitle = dto.ShortTitle;

        if (dto.Location != null)
            session.Location = string.IsNullOrWhiteSpace(dto.Location) ? null : dto.Location;

        if (dto.MeetUrl != null)
            session.MeetUrl = string.IsNullOrWhiteSpace(dto.MeetUrl) ? null : dto.MeetUrl;

        if (dto.EventFormat.HasValue)
        {
            session.EventFormat = dto.EventFormat.Value;

            if (session.EventFormat == EventFormat.Offline)
                session.MeetUrl = null;
            else if (session.EventFormat == EventFormat.Online)
                session.Location = null;
        }

        if (dto.AverageMinutesPerStudent.HasValue)
            session.AverageMinutesPerStudent = dto.AverageMinutesPerStudent.Value;
        if (dto.IsAllowedToSubmitMoreThanOne.HasValue)
            session.IsAllowedToSubmitMoreThanOne = dto.IsAllowedToSubmitMoreThanOne.Value;
        if (dto.SubmissionMode.HasValue)
            session.SubmissionMode = dto.SubmissionMode.Value;
        if (dto.RegistrationStartTime.HasValue)
            session.RegistrationStartTime = dto.RegistrationStartTime.Value;

        // TODO Зберігати десь Id background тасків для створення нових при оновленні даних
        // if (dto.QueueStartTime.HasValue)
        //     session.QueueStartTime = dto.QueueStartTime.Value;
        //
        // if (dto.DurationMinutes.HasValue)
        //     session.Duration = TimeSpan.FromMinutes(dto.DurationMinutes.Value);
        await _appDbContext.SaveChangesAsync();
    }

    public async Task DeleteSessionAsync(Guid sessionId) 
    {
    var sessionValues = await _appDbContext.QueueSessions
        .Where(qs => qs.Id == sessionId)
        .Select(qs => new {
            Title = qs.Title,
            SubjectName = qs.Subject!.Name,
            QueueStatus = qs.QueueStatus
        })
        .FirstOrDefaultAsync()
        ?? throw new KeyNotFoundException("Чергу не знайдено");

    
    if (sessionValues.QueueStatus == QueueStatus.Cancelled || sessionValues.QueueStatus == QueueStatus.Closed)
        throw new InvalidOperationException("Цю чергу вже завершено або скасовано.");

    
    var usersToRefund = await _appDbContext.QueueEntries
        .Where(qn => qn.QueueSessionId == sessionId && 
                     qn.EntryStatus == QueueEntryStatus.Waiting && 
                     qn.UsedToken)
        .Select(qn => qn.UserId)
        .Distinct()
        .ToListAsync();
    
    await _appDbContext.QueueEntries
        .Where(qn => qn.QueueSessionId == sessionId && 
                     (qn.EntryStatus == QueueEntryStatus.Waiting || qn.EntryStatus == QueueEntryStatus.InProgress))
        .ExecuteUpdateAsync(s => s.SetProperty(e => e.EntryStatus, QueueEntryStatus.Cancelled));

    await _appDbContext.QueueSessions
        .Where(qs => qs.Id == sessionId)
        .ExecuteUpdateAsync(s => s.SetProperty(q => q.QueueStatus, QueueStatus.Cancelled));

    if (usersToRefund.Count > 0                         )
    {
        string reason = $"Компенсація за скасовану чергу '{sessionValues.Title}' ({sessionValues.SubjectName})";
        
        foreach (var userId in usersToRefund)
        {
            await _walletService.ChargeTokensAsync(userId, 1, reason);
        }
    }
}

    public async Task AutoOpenSessionRegistrationAsync(Guid sessionId)
    {
        await _appDbContext.QueueSessions
            .Where(q => q.Id == sessionId)
            .Where(q => q.QueueStatus != QueueStatus.Cancelled)
            .ExecuteUpdateAsync(s => s
                .SetProperty(x => x.QueueStatus, QueueStatus.Registration));
    }

    public async Task AutoActivateSessionAsync(Guid sessionId)
    {
        await _appDbContext.QueueSessions
            .Where(q => q.Id == sessionId)
            .Where(q => q.QueueStatus != QueueStatus.Cancelled)
            .ExecuteUpdateAsync(s => s
                .SetProperty(x => x.QueueStatus, QueueStatus.Active));
        
        //Переводимо першого студента в активний стан, щоб почати цикл 
        await MoveToNextStudentInternalAsync(sessionId);
    }

    public async Task AutoCloseSessionAsync(Guid sessionId)
    {
        await _appDbContext.QueueSessions
            .Where(q => q.Id == sessionId)
            .Where(q => q.QueueStatus != QueueStatus.Cancelled)
            .ExecuteUpdateAsync(s => s
                .SetProperty(x => x.QueueStatus, QueueStatus.Closed));
    }

    public async Task JoinSessionAsync(Guid userId, Guid sessionId, JoinQueueDto dto)
    {
        var session = await _appDbContext.QueueSessions
                          .FirstOrDefaultAsync(qs => qs.Id == sessionId)
                      ?? throw new KeyNotFoundException("Черга, до якої ви намагаєтесь приєднатися, не існує");

        if (session.QueueStatus != QueueStatus.Registration && session.QueueStatus != QueueStatus.Active)
            throw new InvalidOperationException("Реєстрація в цю чергу зараз закрита.");
        
        if (!session.IsAllowedToSubmitMoreThanOne && dto.SubmitSecondWork)
            throw new InvalidOperationException(
                "В цій черзі не можна здавати 2 роботи, спробуйте знову тільки з однією.");
        
        if (dto.UsedToken)
        {
            if (session.QueueStatus == QueueStatus.Active)
                throw new InvalidOperationException("Використовувати токени можна лише під час реєстрації, до початку пари.");
            var userBalance = await _walletService.GetBalanceAsync(userId);
            if (userBalance < 1)
                throw new InvalidOperationException("Недостатньо токенів для отримання пріоритету в черзі.");
        }

        bool alreadyJoined = await _appDbContext.QueueEntries
            .AnyAsync(qn => qn.QueueSessionId == sessionId
                            && qn.UserId == userId && (qn.EntryStatus == QueueEntryStatus.Waiting ||
                                                       qn.EntryStatus == QueueEntryStatus.InProgress));

        if (alreadyJoined)
            throw new ArgumentException("Ви вже зареєстровані в цій черзі.");

        int currentGreenOccupancy = await _appDbContext.QueueEntries.CountAsync(qn =>
            qn.QueueSessionId == sessionId && qn.EffectiveWeight > 10 && (qn.EntryStatus == QueueEntryStatus.Waiting ||
                                                                          qn.EntryStatus ==
                                                                          QueueEntryStatus.InProgress));

        var strategy = _weightStrategyFactory.GetWeightStrategy(session.SubmissionMode);
        var now = DateTime.UtcNow;

        var newEntry = new QueueEntry()
        {
            UserId = userId, QueueSessionId = sessionId, EntryStatus = QueueEntryStatus.Waiting,
            EntryType = EntryType.Primary, JoinedAt = now, UsedToken = dto.UsedToken
        };


        newEntry.EffectiveWeight =
            strategy.CalculateWeight(newEntry, session, currentGreenOccupancy, dto.SubmitSecondWork);
        await _appDbContext.QueueEntries.AddAsync(newEntry);

        if (dto.SubmitSecondWork)
        {
            var secondEntry = new QueueEntry()
            {
                UserId = userId, QueueSessionId = sessionId, EntryStatus = QueueEntryStatus.Waiting,
                EntryType = EntryType.Secondary, JoinedAt = now.AddMilliseconds(1), UsedToken = dto.UsedToken
            };
            secondEntry.EffectiveWeight =
                strategy.CalculateWeight(secondEntry, session, currentGreenOccupancy, dto.SubmitSecondWork);

            await _appDbContext.QueueEntries.AddAsync(secondEntry);
        }

        // Токен у користувача забрати якщо використав
        if (dto.UsedToken)
        {
            var subjectName = await _appDbContext.Subjects
                .Where(s => s.Id == session.SubjectId)
                .Select(s => s.Name)
                .FirstOrDefaultAsync() ?? "Невідомий предмет";

            string reason = $"Використання токена для пріоритету в черзі '{session.Title}' ({subjectName})";

            await _walletService.SpendTokensAsync(userId, 1, reason);
        }

        await _appDbContext.SaveChangesAsync();
        // Захист від того що якщо черга пуста і активна і користувач приєднався робимо його активним 
        if (session.QueueStatus == QueueStatus.Active)
        {
            bool isAnyoneInProgress = await _appDbContext.QueueEntries
                .AnyAsync(e => e.QueueSessionId == sessionId && e.EntryStatus == QueueEntryStatus.InProgress);

            if (!isAnyoneInProgress)
            {
                await MoveToNextStudentInternalAsync(sessionId);
            }
        }
    }

    public async Task LeaveSessionAsync(Guid userId, Guid sessionId)
    {
        var sessionValues = await _appDbContext.QueueSessions
                          .Where(qs => qs.Id == sessionId)
                          .Select(qs => new {
                              Title = qs.Title,
                              SubjectName= qs.Subject!.Name,
                              QueueStatus = (QueueStatus?)qs.QueueStatus,
                          })
                          .FirstOrDefaultAsync()
                      ?? throw new KeyNotFoundException("Черга, яку ви намагаєтесь покинути, не існує");

        var usedToken = await _appDbContext.QueueEntries
            .AnyAsync(qn => qn.QueueSessionId == sessionId &&
                            qn.UserId == userId &&
                            qn.EntryStatus == QueueEntryStatus.Waiting &&
                            qn.UsedToken);

        int updatedRows = await _appDbContext.QueueEntries
            .Where(qn => qn.QueueSessionId == sessionId &&
                         qn.UserId == userId &&
                         qn.EntryStatus == QueueEntryStatus.Waiting)
            .ExecuteUpdateAsync(s => s.SetProperty(e => e.EntryStatus, QueueEntryStatus.Cancelled));
        
        if (updatedRows == 0)
            return;

        if (usedToken)
        {
            if (sessionValues.QueueStatus == QueueStatus.Registration)
            {
                string reason = $"Повернення токена з скасування пріоритетного запису для черги '{sessionValues.Title}' ({sessionValues.SubjectName})";

                await _walletService.ChargeTokensAsync(userId, 1, reason); 
            }
        }
    }

    public async Task CompleteCurrentAsync(Guid userId, Guid sessionId)
    {
        if (!await _appDbContext.QueueSessions.AnyAsync(qs => qs.Id == sessionId))
            throw new KeyNotFoundException("Чергу не знайдено");
        
        var currentEntry = await _appDbContext.QueueEntries
            .Where(e => e.QueueSessionId == sessionId && e.EntryStatus == QueueEntryStatus.InProgress)
            .Select(e => new { e.Id, e.UserId })
            .FirstOrDefaultAsync();
        
        if (currentEntry != null)
        { 
            if (currentEntry.UserId != userId)
            {
                throw new UnauthorizedAccessException("Тільки студент, який зараз відповідає можуть завершити запис.");
            }
            await _appDbContext.QueueEntries
                .Where(e => e.Id == currentEntry.Id)
                .ExecuteUpdateAsync(s => s.SetProperty(e => e.EntryStatus, QueueEntryStatus.Completed));
        }

        await MoveToNextStudentInternalAsync(sessionId);
    }

    public async Task SkipCurrentAsync(Guid sessionId)
    {
        var currentEntryId = await _appDbContext.QueueEntries
            .Where(e => e.QueueSessionId == sessionId && e.EntryStatus == QueueEntryStatus.InProgress)
            .Select(e => e.Id)
            .FirstOrDefaultAsync();

        // Якщо не з'явився ставимо статус cancelled, бо не прийшов токен не вертаємо 
        if (currentEntryId != Guid.Empty)
        {
            await _appDbContext.QueueEntries
                .Where(e => e.Id == currentEntryId)
                .ExecuteUpdateAsync(s => s.SetProperty(e => e.EntryStatus, QueueEntryStatus.Cancelled));
        }
        
        
        await MoveToNextStudentInternalAsync(sessionId);
    }

    public async Task ForceCompleteCurrentAsync(Guid sessionId)
    {
        if (!await _appDbContext.QueueSessions.AnyAsync(qs => qs.Id == sessionId))
            throw new KeyNotFoundException("Чергу не знайдено");
        
        var currentEntryId = await _appDbContext.QueueEntries
            .Where(e => e.QueueSessionId == sessionId && e.EntryStatus == QueueEntryStatus.InProgress)
            .Select(e => e.Id)
            .FirstOrDefaultAsync();
        
        if (currentEntryId != Guid.Empty)
        {
            await _appDbContext.QueueEntries
                .Where(e => e.Id == currentEntryId)
                .ExecuteUpdateAsync(s => s.SetProperty(e => e.EntryStatus, QueueEntryStatus.Completed));
        }
        
        
        await MoveToNextStudentInternalAsync(sessionId);
    }

    public async Task<IEnumerable<QueueSessionShortResponseDto>> GetUpcomingAsync(Guid userId, int take = 3)
    {
        return await _appDbContext.QueueSessions
            .Where(qs => qs.QueueEntries.Any(e => 
                e.UserId == userId && 
                (e.EntryStatus == QueueEntryStatus.Waiting || e.EntryStatus == QueueEntryStatus.InProgress)))
            .Where(qs => qs.QueueStatus == QueueStatus.Registration || qs.QueueStatus == QueueStatus.Active)
            .OrderBy(qs => qs.QueueStatus == QueueStatus.Active ? 0 : 1)// Спочатку активні потім де реєстрація
            .ThenBy(qs => qs.QueueStartTime)
            .Take(take)
            .ProjectToSessionShortDto(userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<QueueSessionShortResponseDto>> GetUpcomingAsync(Guid userId, Guid subjectId,
        int take = 3)
    {
        // Повертаємо 3 черги для КОНКРЕТНОГО ПРЕДМЕТА, незалежно чи є користувач в ній чи ні
        return await _appDbContext.QueueSessions
            .Where(qs => qs.SubjectId == subjectId)
            .Where(qs => qs.QueueStatus == QueueStatus.Registration || qs.QueueStatus == QueueStatus.Active)
            .OrderBy(qs => qs.QueueStatus == QueueStatus.Active ? 0 : 1) // Спочатку активні потім де реєстрація
            .ThenBy(qs => qs.QueueStartTime)
            .Take(take)
            .ProjectToSessionShortDto(userId)
            .ToListAsync();
    }
    
    private async Task MoveToNextStudentInternalAsync(Guid sessionId)
    {
        var nextEntryId = await _appDbContext.QueueEntries
            .Where(e => e.QueueSessionId == sessionId && e.EntryStatus == QueueEntryStatus.Waiting)
            .OrderByDescending(e => e.EffectiveWeight)
            .ThenBy(e => e.JoinedAt)
            .Select(e => e.Id)
            .FirstOrDefaultAsync();

        // Якщо такий є робимо його активним
        if (nextEntryId != Guid.Empty)
        {
            await _appDbContext.QueueEntries
                .Where(e => e.Id == nextEntryId)
                .ExecuteUpdateAsync(s => s.SetProperty(e => e.EntryStatus, QueueEntryStatus.InProgress));
        }
    }
}
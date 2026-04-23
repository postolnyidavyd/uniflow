using System.Linq.Expressions;
using Domain.Enums;
using Domain.Models;
using DTOs.QueueDTOs;

namespace Services.Queue;

public static class QueueMapping
{
    #region UI Cards (Всі черги і Мої черги)

    private static Expression<Func<Domain.Models.QueueSession, QueueCardResponseDto>>
        QueueCardDtoExpression(Guid? userId) => qs => new QueueCardResponseDto()
    {
        Id = qs.Id,
        ShortTitle = qs.ShortTitle,
        SubjectName = qs.Subject!.ShortName,
        QueueStatus = qs.QueueStatus,
        QueueStartTime = qs.QueueStartTime,
        RegistrationStartTime = qs.RegistrationStartTime,
        Location = qs.Location,
        MeetUrl = qs.MeetUrl,
        EntriesCount = qs.QueueEntries.Count(e =>
            e.EntryStatus == QueueEntryStatus.Waiting || e.EntryStatus == QueueEntryStatus.InProgress),

        GuaranteedSlots = (int)qs.Duration.TotalMinutes / qs.AverageMinutesPerStudent,

        IsUserJoined = userId.HasValue && qs.QueueEntries.Any(qn =>
            qn.UserId == userId &&
            qn.EntryType == EntryType.Primary &&
            (qn.EntryStatus == QueueEntryStatus.Waiting || qn.EntryStatus == QueueEntryStatus.InProgress)),

        // Витягуємо ім`я студента який зараз здає
        CurrentStudentName = qs.QueueEntries
            .Where(e => e.EntryStatus == QueueEntryStatus.InProgress)
            .Select(e => e.User!.LastName + " " + e.User!.FirstName.Substring(0, 1) + ".")
            .FirstOrDefault()
    };

    public static IQueryable<QueueCardResponseDto> ProjectToQueueCardDto(this IQueryable<QueueSession> query,
        Guid? userId) =>
        query.Select(QueueCardDtoExpression(userId));


    private static Expression<Func<Domain.Models.QueueSession, MyQueueCardResponseDto>>
        MyQueueCardDtoExpression(Guid userId) => qs => new MyQueueCardResponseDto()
    {
        Id = qs.Id,
        ShortTitle = qs.ShortTitle,
        SubjectName = qs.Subject!.ShortName,
        QueueStartTime = qs.QueueStartTime,
        Location = qs.Location,
        MeetUrl = qs.MeetUrl,
        
        CurrentStudentName = qs.QueueEntries
            .Where(e => e.EntryStatus == QueueEntryStatus.InProgress)
            .Select(e => e.User!.LastName + " " + e.User!.FirstName.Substring(0, 1) + ".")
            .FirstOrDefault(),

        // Обчислюємо позицію
        UserPosition = qs.QueueEntries.Count(other =>
            (other.EntryStatus == QueueEntryStatus.Waiting || other.EntryStatus == QueueEntryStatus.InProgress) &&
            (
                other.EffectiveWeight > qs.QueueEntries
                    .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                    .Select(my => my.EffectiveWeight).FirstOrDefault()
                ||
                (other.EffectiveWeight == qs.QueueEntries
                     .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                     .Select(my => my.EffectiveWeight).FirstOrDefault() &&
                 other.JoinedAt < qs.QueueEntries.Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                     .Select(my => my.JoinedAt).FirstOrDefault())
            )
        ) + 1,

        // Гарантовано якщо позиція <= кількості місць
        IsGuaranteed = (qs.QueueEntries.Count(other =>
            (other.EntryStatus == QueueEntryStatus.Waiting || other.EntryStatus == QueueEntryStatus.InProgress) &&
            (
                other.EffectiveWeight > qs.QueueEntries
                    .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                    .Select(my => my.EffectiveWeight).FirstOrDefault()
                ||
                (other.EffectiveWeight == qs.QueueEntries
                     .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                     .Select(my => my.EffectiveWeight).FirstOrDefault() &&
                 other.JoinedAt < qs.QueueEntries.Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                     .Select(my => my.JoinedAt).FirstOrDefault())
            )
        ) + 1) <= ((int)qs.Duration.TotalMinutes / qs.AverageMinutesPerStudent),

        // Час очікування = Кількість людей * Середній час
        EstimatedWaitMinutes = qs.QueueEntries.Count(other =>
            (other.EntryStatus == QueueEntryStatus.Waiting || other.EntryStatus == QueueEntryStatus.InProgress) &&
            (
                other.EffectiveWeight > qs.QueueEntries
                    .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                    .Select(my => my.EffectiveWeight).FirstOrDefault()
                ||
                (other.EffectiveWeight == qs.QueueEntries
                     .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                     .Select(my => my.EffectiveWeight).FirstOrDefault() &&
                 other.JoinedAt < qs.QueueEntries.Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                     .Select(my => my.JoinedAt).FirstOrDefault())
            )
        ) * qs.AverageMinutesPerStudent
    };

    public static IQueryable<MyQueueCardResponseDto> ProjectToMyQueueCardDto(this IQueryable<QueueSession> query,
        Guid userId) =>
        query.Select(MyQueueCardDtoExpression(userId));

    #endregion


    #region Detailed Session

    private static Expression<Func<Domain.Models.QueueSession, QueueSessionDetailResponseDto>>
        SessionDetailDtoExpression => q => new QueueSessionDetailResponseDto()
    {
        Id = q.Id,
        Title = q.Title,
        EventFormat = q.EventFormat,
        Location = q.Location,
        MeetUrl = q.MeetUrl,
        RegistrationStartTime = q.RegistrationStartTime,
        QueueStartTime = q.QueueStartTime,
        Duration = q.Duration,
        AverageMinutesPerStudent = q.AverageMinutesPerStudent,
        GuaranteedSlots = (int)q.Duration.TotalMinutes / q.AverageMinutesPerStudent,
        QueueStatus = q.QueueStatus,
        IsAllowedToSubmitMoreThanOne = q.IsAllowedToSubmitMoreThanOne,
        SubmissionMode = q.SubmissionMode,
        SubjectName = q.Subject!.Name
    };

    public static IQueryable<QueueSessionDetailResponseDto> ProjectToSessionDetailDto(
        this IQueryable<QueueSession> query) =>
        query.Select(SessionDetailDtoExpression);

    #endregion


    #region Calendar Summary

    private static Expression<Func<Domain.Models.QueueSession, QueueSummaryResponseDto>>
        SummaryDtoExpression(Guid userId) => qs => new QueueSummaryResponseDto()
    {
        Id = qs.Id,
        ShortTitle = qs.ShortTitle,
        SubjectName = qs.Subject!.ShortName,
        QueueStartTime = qs.QueueStartTime,
        Location = qs.Location,
        MeetUrl = qs.MeetUrl,

        IsSubscribed =
            qs.Subscribers.Any(u => u.Id == userId)
            ||
            qs.QueueEntries.Any(qe =>
                qe.UserId == userId &&
                (qe.EntryStatus == QueueEntryStatus.Waiting || qe.EntryStatus == QueueEntryStatus.InProgress) &&
                qe.User!.UserCalendarSettings != null &&
                qe.User.UserCalendarSettings.AutoAddUserQueueEvents)
    };

    public static IQueryable<QueueSummaryResponseDto> ProjectToSummaryDto(this IQueryable<QueueSession> query,
        Guid userId) =>
        query.Select(SummaryDtoExpression(userId));

    #endregion


    #region Queue Entries (Live State)

    private static Expression<Func<Domain.Models.QueueEntry, QueueEntryDto>>
        EntryDtoExpression => qn => new QueueEntryDto()
    {
        Id = qn.Id,
        UserId = qn.UserId,
        Username = $"{qn.User!.LastName} {qn.User!.FirstName[0]}.",
        EntryType = qn.EntryType,
        Weight = qn.EffectiveWeight,
        UsedToken = qn.UsedToken,
        EntryStatus = qn.EntryStatus,
        JoinedAt = qn.JoinedAt,
    };

    public static IQueryable<QueueEntryDto> ProjectToDto(this IQueryable<QueueEntry> query) =>
        query.Select(EntryDtoExpression);

    #endregion
    
    
    #region QueueShort (На видалення після рефакторингу)

    private static Expression<Func<Domain.Models.QueueSession, QueueSessionShortResponseDto>>
        SessionShortResponseDtoExpression(Guid? userId) => qs => new QueueSessionShortResponseDto()
    {
        Id = qs.Id,
        ShortTitle = qs.ShortTitle,
        QueueStatus = qs.QueueStatus,
        QueueStartTime = qs.QueueStartTime,

        EntriesCount = qs.QueueEntries.Count(e =>
            e.EntryStatus == QueueEntryStatus.Waiting || e.EntryStatus == QueueEntryStatus.InProgress),

        SubjectName = qs.Subject!.ShortName,

        UserPosition = !userId.HasValue || !qs.QueueEntries.Any(qn =>
            qn.UserId == userId && qn.EntryType == EntryType.Primary && (qn.EntryStatus == QueueEntryStatus.Waiting ||
                                                                         qn.EntryStatus == QueueEntryStatus.InProgress))
            ? null
            : qs.QueueEntries.Count(other =>
                (other.EntryStatus == QueueEntryStatus.Waiting || other.EntryStatus == QueueEntryStatus.InProgress) &&
                (
                    other.EffectiveWeight > qs.QueueEntries
                        .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                        .Select(my => my.EffectiveWeight).FirstOrDefault()
                    ||
                    (other.EffectiveWeight == qs.QueueEntries
                         .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                         .Select(my => my.EffectiveWeight).FirstOrDefault()
                     &&
                     other.JoinedAt < qs.QueueEntries
                         .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                         .Select(my => my.JoinedAt).FirstOrDefault())
                )
            ) + 1
    };

    public static IQueryable<QueueSessionShortResponseDto> ProjectToSessionShortDto(this IQueryable<QueueSession> query,
        Guid? userId) =>
        query.Select(SessionShortResponseDtoExpression(userId));

    #endregion
}
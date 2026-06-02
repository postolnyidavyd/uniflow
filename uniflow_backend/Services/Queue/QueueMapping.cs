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

        // Обчислюємо позицію для першого активного запису юзера
        UserPosition = qs.QueueEntries
            .Where(my => my.UserId == userId && (my.EntryStatus == QueueEntryStatus.Waiting || my.EntryStatus == QueueEntryStatus.InProgress))
            .OrderBy(my => my.EntryType == EntryType.Primary ? 0 : 1)
            .Select(my => qs.QueueEntries.Count(other =>
                (other.EntryStatus == QueueEntryStatus.Waiting || other.EntryStatus == QueueEntryStatus.InProgress) &&
                (
                    other.EffectiveWeight > my.EffectiveWeight
                    ||
                    (other.EffectiveWeight == my.EffectiveWeight && other.JoinedAt < my.JoinedAt)
                )
            ) + 1)
            .FirstOrDefault(),

        // Гарантовано якщо позиція <= кількості місць
        IsGuaranteed = qs.QueueEntries
            .Where(my => my.UserId == userId && (my.EntryStatus == QueueEntryStatus.Waiting || my.EntryStatus == QueueEntryStatus.InProgress))
            .OrderBy(my => my.EntryType == EntryType.Primary ? 0 : 1)
            .Select(my => (qs.QueueEntries.Count(other =>
                (other.EntryStatus == QueueEntryStatus.Waiting || other.EntryStatus == QueueEntryStatus.InProgress) &&
                (
                    other.EffectiveWeight > my.EffectiveWeight
                    ||
                    (other.EffectiveWeight == my.EffectiveWeight && other.JoinedAt < my.JoinedAt)
                )
            ) + 1) <= ((int)qs.Duration.TotalMinutes / qs.AverageMinutesPerStudent))
            .FirstOrDefault(),

        // Час очікування = Кількість людей ПЕРЕД тобою * Середній час
        EstimatedWaitMinutes = qs.QueueEntries
            .Where(my => my.UserId == userId && (my.EntryStatus == QueueEntryStatus.Waiting || my.EntryStatus == QueueEntryStatus.InProgress))
            .OrderBy(my => my.EntryType == EntryType.Primary ? 0 : 1)
            .Select(my => qs.QueueEntries.Count(other =>
                (other.EntryStatus == QueueEntryStatus.Waiting || other.EntryStatus == QueueEntryStatus.InProgress) &&
                (
                    other.EffectiveWeight > my.EffectiveWeight
                    ||
                    (other.EffectiveWeight == my.EffectiveWeight && other.JoinedAt < my.JoinedAt)
                )
            ) * qs.AverageMinutesPerStudent)
            .FirstOrDefault(),
        
        QueueStatus = qs.QueueStatus,
        UsedToken = qs.QueueEntries
            .Where(e => e.UserId == userId && (e.EntryStatus == QueueEntryStatus.Waiting || e.EntryStatus == QueueEntryStatus.InProgress))
            .OrderBy(e => e.EntryType == EntryType.Primary ? 0 : 1)
            .Select(e => e.UsedToken)
            .FirstOrDefault(),
    };

    public static IQueryable<MyQueueCardResponseDto> ProjectToMyQueueCardDto(this IQueryable<QueueSession> query,
        Guid userId) =>
        query.Select(MyQueueCardDtoExpression(userId));

    #endregion


    #region Detailed Session

    private static Expression<Func<Domain.Models.QueueSession, QueueSessionDetailResponseDto>>
        SessionDetailDtoExpression(Guid userId) => q => new QueueSessionDetailResponseDto()
    {
        Id = q.Id,
        Title = q.Title,
        ShortTitle = q.ShortTitle,
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
        SubjectId = q.SubjectId,
        SubjectName = q.Subject!.Name,
        IsSubscribed = q.Subscribers.Any(u => u.Id == userId)
    };

    public static IQueryable<QueueSessionDetailResponseDto> ProjectToSessionDetailDto(
        this IQueryable<QueueSession> query, Guid userId) =>
        query.Select(SessionDetailDtoExpression(userId));

    #endregion


    #region Calendar Summary

    private static Expression<Func<Domain.Models.QueueSession, QueueSummaryResponseDto>>
        SummaryDtoExpression(Guid userId, bool autoAdd) => qs => new QueueSummaryResponseDto()
    {
        Id = qs.Id,
        ShortTitle = qs.ShortTitle,
        SubjectName = qs.Subject!.ShortName,
        QueueStartTime = qs.QueueStartTime,
        Location = qs.Location,
        MeetUrl = qs.MeetUrl,

        IsSubscribed =
            autoAdd
            ||
            qs.Subscribers.Any(u => u.Id == userId)
            ||
            qs.Subject!.Subscribers.Any(u => u.Id == userId)
            ||
            qs.QueueEntries.Any(qe =>
                qe.UserId == userId &&
                (qe.EntryStatus == QueueEntryStatus.Waiting || qe.EntryStatus == QueueEntryStatus.InProgress) &&
                qe.User!.UserCalendarSettings != null &&
                qe.User.UserCalendarSettings.AutoAddUserQueueEvents)
    };

    public static IQueryable<QueueSummaryResponseDto> ProjectToSummaryDto(this IQueryable<QueueSession> query,
        Guid userId, bool autoAdd = false) =>
        query.Select(SummaryDtoExpression(userId, autoAdd));

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

        UserPosition = !userId.HasValue ? null :
            qs.QueueEntries
                .Where(my => my.UserId == userId && (my.EntryStatus == QueueEntryStatus.Waiting || my.EntryStatus == QueueEntryStatus.InProgress))
                .OrderBy(my => my.EntryType == EntryType.Primary ? 0 : 1)
                .Select(my => qs.QueueEntries.Count(other =>
                    (other.EntryStatus == QueueEntryStatus.Waiting || other.EntryStatus == QueueEntryStatus.InProgress) &&
                    (
                        other.EffectiveWeight > my.EffectiveWeight
                        ||
                        (other.EffectiveWeight == my.EffectiveWeight && other.JoinedAt < my.JoinedAt)
                    )
                ) + 1)
                .Cast<int?>()
                .FirstOrDefault()
    };

    public static IQueryable<QueueSessionShortResponseDto> ProjectToSessionShortDto(this IQueryable<QueueSession> query,
        Guid? userId) =>
        query.Select(SessionShortResponseDtoExpression(userId));

    #endregion
}
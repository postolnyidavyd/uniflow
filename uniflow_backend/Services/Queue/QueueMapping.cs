using System.Linq.Expressions;
using System.Runtime.CompilerServices;
using Domain.Enums;
using Domain.Models;
using DTOs.EventDTOs;
using DTOs.QueueDTOs;

namespace Services.Queue;

public static class QueueMapping
{
    private static Expression<Func<Domain.Models.QueueSession, QueueSessionDetailResponseDto>>
        SessionDetailDtoExpression =>
        q => new QueueSessionDetailResponseDto()
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
            EntriesCount = q.QueueEntries.Count,
            GuaranteedSlots = (int)q.Duration.TotalMinutes / q.AverageMinutesPerStudent,
            QueueStatus = q.QueueStatus,
            IsAllowedToSubmitMoreThanOne = q.IsAllowedToSubmitMoreThanOne,
            SubmissionMode = q.SubmissionMode,
            SubjectName = q.Subject!.Name
        };

    public static IQueryable<QueueSessionDetailResponseDto> ProjectToSessionDetailDto(
        this IQueryable<QueueSession> query) =>
        query.Select(SessionDetailDtoExpression);

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

    private static Expression<Func<Domain.Models.QueueSession, QueueSessionShortResponseDto>>
        SessionShortResponseDtoExpression(Guid? userId) => qs => new QueueSessionShortResponseDto()
    {
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
                    //Вага більша за користувача 
                    other.EffectiveWeight > qs.QueueEntries
                        .Where(my => my.UserId == userId && my.EntryType == EntryType.Primary)
                        .Select(my => my.EffectiveWeight).FirstOrDefault()
                    ||
                    //Вага та сама але раніше зайшли
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

    public static IQueryable<QueueSummaryResponseDto> ProjectToSummaryDto(
        this IQueryable<QueueSession> query, Guid userId) =>
        query.Select(SummaryDtoExpression(userId));
}
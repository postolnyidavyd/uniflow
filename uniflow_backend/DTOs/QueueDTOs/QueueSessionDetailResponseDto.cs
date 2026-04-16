using Domain.Enums;
using Domain.Models;

namespace DTOs.QueueDTOs;

public class QueueSessionDetailResponseDto
{
    public Guid Id { get; set; }
    
    public required string Title { get; set; }

    public EventFormat EventFormat { get; set; }
    
    public string? Location { get; set; } 
    public string? MeetUrl { get; set; } 
    
    public DateTime RegistrationStartTime { get; set; }
    public DateTime QueueStartTime { get; set; }
    
    public TimeSpan Duration { get; set; } // Можливо поставити int але під питанням
    public int AverageMinutesPerStudent { get; set; }
    
    public int EntriesCount { get; set; }
    public int GuaranteedSlots { get; set; }// Може і фронт розраховувати
    
    public QueueStatus QueueStatus { get; set; } 

    public bool IsAllowedToSubmitMoreThanOne { get; set; }
    public SubmissionMode? SubmissionMode { get; set; }

    // public Guid SubjectId { get; set; }
    public string SubjectName { get; set; }
    
    
}
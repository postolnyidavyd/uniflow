using Domain.Enums;
using Domain.Models;

namespace DTOs.QueueDTOs;

public class CreateQueueSessionDto
{
    public required string Title { get; set; }
    public required string ShortTitle { get; set; }

    public EventFormat EventFormat { get; set; }
    public string? Location { get; set; } 
    public string? MeetUrl { get; set; } 
    
    public DateTime RegistrationStartTime { get; set; }
    public DateTime QueueStartTime { get; set; }
    
    public int DurationMinutes { get; set; }
    
    public int AverageMinutesPerStudent { get; set; }

    public bool IsAllowedToSubmitMoreThanOne { get; set; }
    public SubmissionMode? SubmissionMode { get; set; }

    public Guid SubjectId { get; set; }
}
using Domain.Enums;
using DTOs.QueueDTOs;
using FluentValidation;

namespace DTOs.Validators;

public class UpdateQueueSessionDtoValidator : AbstractValidator<UpdateQueueSessionDto>
{
    public UpdateQueueSessionDtoValidator()
    {
        RuleLevelCascadeMode = CascadeMode.Stop;


        RuleFor(x => x.Title)
            .MaximumLength(100).WithMessage("Назва не може перевищувати 100 символів")
            .When(x => x.Title != null);

        RuleFor(x => x.ShortTitle)
            .MaximumLength(20).WithMessage("Коротка назва не може перевищувати 20 символів")
            .When(x => x.ShortTitle != null);

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Тривалість має бути більше 0 хвилин")
            .LessThanOrEqualTo(300).WithMessage("Тривалість не може перевищувати 300 хвилин")
            .When(x => x.DurationMinutes.HasValue);

        RuleFor(x => x.AverageMinutesPerStudent)
            .GreaterThan(0).WithMessage("Середній час на студента має бути більше 0")
            .LessThanOrEqualTo(60).WithMessage("Середній час не може перевищувати 60 хвилин")
            .When(x => x.AverageMinutesPerStudent.HasValue);

        RuleFor(x => x.RegistrationStartTime)
            .GreaterThan(DateTime.UtcNow).WithMessage("Час початку реєстрації має бути в майбутньому")
            .When(x => x.RegistrationStartTime.HasValue);

        RuleFor(x => x.MeetUrl)
            .NotEmpty().WithMessage("Посилання обов'язкове для онлайн черги")
            .When(x => x.EventFormat.HasValue && x.EventFormat == EventFormat.Online);

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Локація обов'язкова для офлайн черги")
            .When(x => x.EventFormat.HasValue && x.EventFormat == EventFormat.Offline);
    }
}
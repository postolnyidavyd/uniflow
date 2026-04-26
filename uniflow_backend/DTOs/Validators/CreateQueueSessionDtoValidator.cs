using Domain.Enums;
using DTOs.QueueDTOs;
using FluentValidation;

namespace DTOs.Validators;

public class CreateQueueSessionDtoValidator : AbstractValidator<CreateQueueSessionDto>
{
    public CreateQueueSessionDtoValidator()
    {
        RuleLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Назва обов'язкова")
            .MaximumLength(100).WithMessage("Назва не може перевищувати 100 символів");

        RuleFor(x => x.ShortTitle)
            .NotEmpty().WithMessage("Коротка назва обов'язкова")
            .MaximumLength(20).WithMessage("Коротка назва не може перевищувати 20 символів");

        RuleFor(x => x.RegistrationStartTime)
            .GreaterThan(DateTime.UtcNow)
            .WithMessage("Час початку реєстрації має бути в майбутньому");

        RuleFor(x => x.QueueStartTime)
            .GreaterThan(x => x.RegistrationStartTime)
            .WithMessage("Час початку черги має бути пізніше часу початку реєстрації");

        RuleFor(x => x.DurationMinutes)
            .GreaterThan(0).WithMessage("Тривалість має бути більше 0 хвилин")
            .LessThanOrEqualTo(300).WithMessage("Тривалість не може перевищувати 300 хвилин");

        RuleFor(x => x.AverageMinutesPerStudent)
            .GreaterThan(0).WithMessage("Середній час на студента має бути більше 0")
            .LessThanOrEqualTo(60).WithMessage("Середній час на студента не може перевищувати 60 хвилин");

        RuleFor(x => x.SubjectId)
            .NotEmpty().WithMessage("Предмет обов'язковий");

        RuleFor(x => x.MeetUrl)
            .NotEmpty().WithMessage("Посилання обов'язкове для онлайн черги")
            .When(x => x.EventFormat == EventFormat.Online);

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Локація обов'язкова для офлайн черги")
            .When(x => x.EventFormat == EventFormat.Offline);

        // Якщо не дозволено здавати більше однієї — SubmissionMode має бути Single
        RuleFor(x => x.SubmissionMode)
            .Must(mode => mode == SubmissionMode.Single || mode == null)
            .WithMessage("Режим здачі має бути Single якщо не дозволено здавати більше однієї роботи")
            .When(x => !x.IsAllowedToSubmitMoreThanOne);
    }
}
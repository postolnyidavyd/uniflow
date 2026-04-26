using Domain.Enums;
using DTOs.EventDTOs;
using FluentValidation;

namespace DTOs.Validators;

public class UpdateEventDtoValidator : AbstractValidator<UpdateEventDto>
{
    public UpdateEventDtoValidator()
    {
        RuleLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.Title)
            .MaximumLength(100).WithMessage("Назва не може перевищувати 100 символів")
            .When(x => x.Title != null);

        RuleFor(x => x.ShortTitle)
            .MaximumLength(20).WithMessage("Коротка назва не може перевищувати 20 символів")
            .When(x => x.ShortTitle != null);

        RuleFor(x => x.Date)
            .GreaterThan(DateTime.UtcNow).WithMessage("Дата події має бути в майбутньому")
            .When(x => x.Date.HasValue);

        RuleFor(x => x.MeetUrl)
            .NotEmpty().WithMessage("Посилання обов'язкове для онлайн події")
            .When(x => x.EventFormat.HasValue && x.EventFormat == EventFormat.Online);

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Локація обов'язкова для офлайн події")
            .When(x => x.EventFormat.HasValue && x.EventFormat == EventFormat.Offline);
    }
}
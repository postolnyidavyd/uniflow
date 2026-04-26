using Domain.Enums;
using DTOs.EventDTOs;
using FluentValidation;

namespace DTOs.Validators;

public class CreateEventDtoValidator : AbstractValidator<CreateEventDto>
{
    public CreateEventDtoValidator()
    {
        RuleLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Назва обов'язкова")
            .MaximumLength(100).WithMessage("Назва не може перевищувати 100 символів");

        RuleFor(x => x.ShortTitle)
            .NotEmpty().WithMessage("Коротка назва обов'язкова")
            .MaximumLength(20).WithMessage("Коротка назва не може перевищувати 20 символів");

        RuleFor(x => x.Date)
            .GreaterThan(DateTime.UtcNow).WithMessage("Дата події має бути в майбутньому");

        RuleFor(x => x.SubjectId)
            .NotEmpty().WithMessage("Предмет обов'язковий");

        RuleFor(x => x.MeetUrl)
            .NotEmpty().WithMessage("Посилання обов'язкове для онлайн події")
            .When(x => x.EventFormat == EventFormat.Online);

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage("Локація обов'язкова для офлайн події")
            .When(x => x.EventFormat == EventFormat.Offline);
    }
}
using DTOs.SubjectDTOs;
using FluentValidation;

namespace DTOs.Validators;

public class UpdateSubjectDtoValidator : AbstractValidator<UpdateSubjectDto>
{
    public UpdateSubjectDtoValidator()
    {
        RuleLevelCascadeMode = CascadeMode.Stop;

        RuleFor(x => x.Name)
            .MaximumLength(100).WithMessage("Назва не може перевищувати 100 символів")
            .When(x => x.Name != null);

        RuleFor(x => x.ShortName)
            .MaximumLength(20).WithMessage("Коротке ім'я не може перевищувати 20 символів")
            .When(x => x.ShortName != null);

        RuleFor(x => x.Lecturer)
            .MaximumLength(100).WithMessage("Ім'я викладача не може перевищувати 100 символів")
            .When(x => x.Lecturer != null);
    }
}
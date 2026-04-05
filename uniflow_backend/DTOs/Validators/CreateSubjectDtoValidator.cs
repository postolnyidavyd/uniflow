using DTOs.SubjectDTOs;
using FluentValidation;

namespace DTOs.Validators;

public class CreateSubjectDtoValidator: AbstractValidator<CreateSubjectDto>
{
    public CreateSubjectDtoValidator()
    {
                RuleLevelCascadeMode = CascadeMode.Stop;
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Ім'я обов'язкове");
        
        RuleFor(x => x.ShortName)
            .NotEmpty().WithMessage("Коротке ім'я обов'язкове")
            .MaximumLength(20).WithMessage("Коротке ім'я має бути не менше 20 символів");
        
        RuleFor(x => x.Lecturer)
            .NotEmpty().WithMessage("Викладач обов'язковий");
    }
}
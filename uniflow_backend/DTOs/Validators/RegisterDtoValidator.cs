using DTOs.AuthDTOs;
using FluentValidation;

namespace DTOs.Validators;

public class RegisterDtoValidator: AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleLevelCascadeMode = CascadeMode.Stop;
        
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Пошта обов'язкова")
            .EmailAddress().WithMessage("Невірний формат пошти");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обов'язковий")
            .MinimumLength(6).WithMessage("Пароль мінімум 6 символів");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Ім'я обов'язкове")
            .MaximumLength(50);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Прізвище обов'язкове")
            .MaximumLength(50);

        RuleFor(x => x.Group)
            .NotEmpty().WithMessage("Група обов'язкова");
    }
}
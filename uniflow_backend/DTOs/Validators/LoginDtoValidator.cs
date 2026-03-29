using DTOs.AuthDTOs;
using FluentValidation;

namespace DTOs.Validators;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Пошта обов'язкова")
            .EmailAddress().WithMessage("Невірний формат пошти");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обов'язковий");
    }
}
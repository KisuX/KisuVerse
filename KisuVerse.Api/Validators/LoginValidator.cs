using FluentValidation;
using KisuVerse.Api.Dtos.Auth;

namespace KisuVerse.Api.Validators;

public class LoginValidator : AbstractValidator<LoginDto>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email query is required.")
            .EmailAddress()
            .WithMessage("Email format is invalid.")
            .MaximumLength(255)
            .WithMessage("Email query cannot exceed 255 characters.");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("Password query is required.");
    }
}
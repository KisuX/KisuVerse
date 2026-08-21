using FluentValidation;
using KisuVerse.Api.Dtos.Auth;

namespace KisuVerse.Api.Validators;

public class ChangePasswordValidator : AbstractValidator<ChangePasswordDto>
{
    public ChangePasswordValidator()
    {
        RuleFor(x => x.CurrentPassword)
            .NotEmpty()
            .WithMessage("Current password is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty()
            .WithMessage("New password is required.")
            .MinimumLength(8)
            .WithMessage("New password must be at least 8 characters.")
            .MaximumLength(100)
            .WithMessage("New password cannot exceed 100 characters.");
    }
}

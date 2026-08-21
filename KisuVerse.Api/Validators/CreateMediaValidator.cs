using FluentValidation;
using KisuVerse.Api.Dtos.Media;

namespace KisuVerse.Api.Validators;

public class CreateMediaValidator : AbstractValidator<CreateMediaDto>
{
    public CreateMediaValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title is required.")
            .MaximumLength(200)
            .WithMessage("Title cannot exceed 200 characters.");

        RuleFor(x => x.Overview)
            .NotEmpty()
            .WithMessage("Overview is required.")
            .MaximumLength(2000)
            .WithMessage("Overview cannot exceed 2000 characters.");

        RuleFor(x => x.Director)
            .NotEmpty()
            .WithMessage("Director is required.")
            .MaximumLength(100)
            .WithMessage("Director cannot exceed 100 characters.");

        RuleFor(x => x.Writer)
            .MaximumLength(100)
            .WithMessage("Writer cannot exceed 100 characters.");

        RuleFor(x => x.GenreIds)
            .NotEmpty()
            .WithMessage("Genre IDs are required.");

        RuleFor(x => x.Cast)
            .MaximumLength(500)
            .WithMessage("Cast cannot exceed 500 characters.");

        RuleFor(x => x.Language)
            .NotEmpty()
            .WithMessage("Language is required.");

        RuleFor(x => x.Country)
            .NotEmpty()
            .WithMessage("Country is required.");

        RuleFor(x => x.Duration)
            .InclusiveBetween(1, 500)
            .WithMessage("Duration must be between 1 and 500.");

        RuleFor(x => x.Rating)
            .InclusiveBetween(0, 10)
            .WithMessage("Rating must be between 0 and 10.");


    }
}
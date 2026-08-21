using FluentValidation;
using KisuVerse.Api.Dtos.Common;

namespace KisuVerse.Api.Validators;

public class SearchRequestValidator : AbstractValidator<SearchRequestDto>
{
    public SearchRequestValidator()
    {
        RuleFor(x => x.Query)
            .MaximumLength(100)
            .WithMessage("Search query cannot exceed 100 characters.");

        When(x => !string.IsNullOrEmpty(x.Query), () =>
        {
            RuleFor(x => x.Query)
                .MinimumLength(2)
                .WithMessage("Search query must be at least 2 characters.");
        });

        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1);

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100);
    }
}
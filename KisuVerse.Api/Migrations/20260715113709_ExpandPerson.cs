using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KisuVerse.Api.Migrations
{
    /// <inheritdoc />
    public partial class ExpandPerson : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Biography",
                table: "People",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateOnly>(
                name: "DeathDay",
                table: "People",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "KnownForDepartment",
                table: "People",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlaceOfBirth",
                table: "People",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Biography",
                table: "People");

            migrationBuilder.DropColumn(
                name: "DeathDay",
                table: "People");

            migrationBuilder.DropColumn(
                name: "KnownForDepartment",
                table: "People");

            migrationBuilder.DropColumn(
                name: "PlaceOfBirth",
                table: "People");
        }
    }
}

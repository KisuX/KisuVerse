using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KisuVerse.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaCreatedByUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Media",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Media_CreatedByUserId",
                table: "Media",
                column: "CreatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Media_AspNetUsers_CreatedByUserId",
                table: "Media",
                column: "CreatedByUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Media_AspNetUsers_CreatedByUserId",
                table: "Media");

            migrationBuilder.DropIndex(
                name: "IX_Media_CreatedByUserId",
                table: "Media");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Media");
        }
    }
}

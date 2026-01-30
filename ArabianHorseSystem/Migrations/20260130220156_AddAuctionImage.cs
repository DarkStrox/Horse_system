using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArabianHorseSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddAuctionImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "image_url",
                table: "auctions",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "image_url",
                table: "auctions");
        }
    }
}

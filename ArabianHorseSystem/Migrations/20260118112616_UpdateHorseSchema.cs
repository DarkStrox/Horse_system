using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ArabianHorseSystem.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHorseSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "since",
                table: "owners",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "claim_location",
                table: "horse_profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "health_status",
                table: "horse_profiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_approved",
                table: "horse_profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "is_for_sale",
                table: "horse_profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "price",
                table: "horse_profiles",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "racing_history",
                table: "horse_profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "vaccinated",
                table: "horse_profiles",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "since",
                table: "owners");

            migrationBuilder.DropColumn(
                name: "claim_location",
                table: "horse_profiles");

            migrationBuilder.DropColumn(
                name: "health_status",
                table: "horse_profiles");

            migrationBuilder.DropColumn(
                name: "is_approved",
                table: "horse_profiles");

            migrationBuilder.DropColumn(
                name: "is_for_sale",
                table: "horse_profiles");

            migrationBuilder.DropColumn(
                name: "price",
                table: "horse_profiles");

            migrationBuilder.DropColumn(
                name: "racing_history",
                table: "horse_profiles");

            migrationBuilder.DropColumn(
                name: "vaccinated",
                table: "horse_profiles");
        }
    }
}

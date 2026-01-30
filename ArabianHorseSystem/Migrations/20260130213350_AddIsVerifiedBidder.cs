using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ArabianHorseSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddIsVerifiedBidder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "auction_date",
                table: "auctions",
                newName: "start_time");

            migrationBuilder.AddColumn<bool>(
                name: "is_verified_bidder",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "video_url",
                table: "horse_profiles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "auctions",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<decimal>(
                name: "base_price",
                table: "auctions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "created_by_id",
                table: "auctions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "current_bid",
                table: "auctions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "end_time",
                table: "auctions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<decimal>(
                name: "minimum_increment",
                table: "auctions",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "video_url",
                table: "auctions",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "winner_id",
                table: "auctions",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "bids",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    auction_id = table.Column<int>(type: "integer", nullable: false),
                    bidder_id = table.Column<int>(type: "integer", nullable: false),
                    amount = table.Column<decimal>(type: "numeric", nullable: false),
                    timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_bids", x => x.id);
                    table.ForeignKey(
                        name: "fk_bids_auctions_auction_id",
                        column: x => x.auction_id,
                        principalTable: "auctions",
                        principalColumn: "auction_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_bids_users_bidder_id",
                        column: x => x.bidder_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_auctions_created_by_id",
                table: "auctions",
                column: "created_by_id");

            migrationBuilder.CreateIndex(
                name: "ix_auctions_winner_id",
                table: "auctions",
                column: "winner_id");

            migrationBuilder.CreateIndex(
                name: "ix_bids_auction_id",
                table: "bids",
                column: "auction_id");

            migrationBuilder.CreateIndex(
                name: "ix_bids_bidder_id",
                table: "bids",
                column: "bidder_id");

            migrationBuilder.AddForeignKey(
                name: "fk_auctions_users_created_by_id",
                table: "auctions",
                column: "created_by_id",
                principalTable: "users",
                principalColumn: "user_id");

            migrationBuilder.AddForeignKey(
                name: "fk_auctions_users_winner_id",
                table: "auctions",
                column: "winner_id",
                principalTable: "users",
                principalColumn: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_auctions_users_created_by_id",
                table: "auctions");

            migrationBuilder.DropForeignKey(
                name: "fk_auctions_users_winner_id",
                table: "auctions");

            migrationBuilder.DropTable(
                name: "bids");

            migrationBuilder.DropIndex(
                name: "ix_auctions_created_by_id",
                table: "auctions");

            migrationBuilder.DropIndex(
                name: "ix_auctions_winner_id",
                table: "auctions");

            migrationBuilder.DropColumn(
                name: "is_verified_bidder",
                table: "users");

            migrationBuilder.DropColumn(
                name: "video_url",
                table: "horse_profiles");

            migrationBuilder.DropColumn(
                name: "base_price",
                table: "auctions");

            migrationBuilder.DropColumn(
                name: "created_by_id",
                table: "auctions");

            migrationBuilder.DropColumn(
                name: "current_bid",
                table: "auctions");

            migrationBuilder.DropColumn(
                name: "end_time",
                table: "auctions");

            migrationBuilder.DropColumn(
                name: "minimum_increment",
                table: "auctions");

            migrationBuilder.DropColumn(
                name: "video_url",
                table: "auctions");

            migrationBuilder.DropColumn(
                name: "winner_id",
                table: "auctions");

            migrationBuilder.RenameColumn(
                name: "start_time",
                table: "auctions",
                newName: "auction_date");

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "auctions",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}

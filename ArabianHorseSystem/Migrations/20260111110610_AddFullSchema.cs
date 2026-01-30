using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ArabianHorseSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddFullSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "role",
                table: "users",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "colours",
                columns: table => new
                {
                    colour_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_colours", x => x.colour_id);
                });

            migrationBuilder.CreateTable(
                name: "equine_vets",
                columns: table => new
                {
                    vet_id = table.Column<int>(type: "integer", nullable: false),
                    ssn = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    veterinary_license = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_equine_vets", x => x.vet_id);
                    table.ForeignKey(
                        name: "fk_equine_vets_users_vet_id",
                        column: x => x.vet_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "locations",
                columns: table => new
                {
                    location_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    government = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    city = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    address = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_locations", x => x.location_id);
                });

            migrationBuilder.CreateTable(
                name: "owners",
                columns: table => new
                {
                    owner_id = table.Column<int>(type: "integer", nullable: false),
                    preferences = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_owners", x => x.owner_id);
                    table.ForeignKey(
                        name: "fk_owners_users_owner_id",
                        column: x => x.owner_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "pedigrees",
                columns: table => new
                {
                    ped_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    father_horse_name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    mother_horse_name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    lineage_notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_pedigrees", x => x.ped_id);
                });

            migrationBuilder.CreateTable(
                name: "trainers",
                columns: table => new
                {
                    trainer_id = table.Column<int>(type: "integer", nullable: false),
                    experience_years = table.Column<int>(type: "integer", nullable: false),
                    bio = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_trainers", x => x.trainer_id);
                    table.ForeignKey(
                        name: "fk_trainers_users_trainer_id",
                        column: x => x.trainer_id,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "maneges",
                columns: table => new
                {
                    manege_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    surface_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    capacity = table.Column<int>(type: "integer", nullable: false),
                    availability_schedule = table.Column<string>(type: "text", nullable: true),
                    location_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_maneges", x => x.manege_id);
                    table.ForeignKey(
                        name: "fk_maneges_locations_location_id",
                        column: x => x.location_id,
                        principalTable: "locations",
                        principalColumn: "location_id");
                });

            migrationBuilder.CreateTable(
                name: "studs",
                columns: table => new
                {
                    stud_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    stud_type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    stall_capacity = table.Column<int>(type: "integer", nullable: false),
                    boarding_price = table.Column<decimal>(type: "numeric", nullable: false),
                    num_of_horses = table.Column<int>(type: "integer", nullable: false),
                    num_of_males = table.Column<int>(type: "integer", nullable: false),
                    num_of_females = table.Column<int>(type: "integer", nullable: false),
                    url = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    location_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_studs", x => x.stud_id);
                    table.ForeignKey(
                        name: "fk_studs_locations_location_id",
                        column: x => x.location_id,
                        principalTable: "locations",
                        principalColumn: "location_id");
                });

            migrationBuilder.CreateTable(
                name: "training_programmes",
                columns: table => new
                {
                    program_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name_of_program = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    start_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    end_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    trainer_id = table.Column<int>(type: "integer", nullable: true),
                    manege_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_training_programmes", x => x.program_id);
                    table.ForeignKey(
                        name: "fk_training_programmes_maneges_manege_id",
                        column: x => x.manege_id,
                        principalTable: "maneges",
                        principalColumn: "manege_id");
                    table.ForeignKey(
                        name: "fk_training_programmes_trainers_trainer_id",
                        column: x => x.trainer_id,
                        principalTable: "trainers",
                        principalColumn: "trainer_id");
                });

            migrationBuilder.CreateTable(
                name: "horse_profiles",
                columns: table => new
                {
                    microchip_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    age = table.Column<int>(type: "integer", nullable: true),
                    gender = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    breed = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    life_status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    birthdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    image_url = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    pedigree_image_url = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    colour_id = table.Column<int>(type: "integer", nullable: true),
                    owner_id = table.Column<int>(type: "integer", nullable: true),
                    stud_id = table.Column<int>(type: "integer", nullable: true),
                    ped_id = table.Column<int>(type: "integer", nullable: true),
                    pedigree_ped_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_horse_profiles", x => x.microchip_id);
                    table.ForeignKey(
                        name: "fk_horse_profiles_colours_colour_id",
                        column: x => x.colour_id,
                        principalTable: "colours",
                        principalColumn: "colour_id");
                    table.ForeignKey(
                        name: "fk_horse_profiles_owners_owner_id",
                        column: x => x.owner_id,
                        principalTable: "owners",
                        principalColumn: "owner_id");
                    table.ForeignKey(
                        name: "fk_horse_profiles_pedigrees_pedigree_ped_id",
                        column: x => x.pedigree_ped_id,
                        principalTable: "pedigrees",
                        principalColumn: "ped_id");
                    table.ForeignKey(
                        name: "fk_horse_profiles_studs_stud_id",
                        column: x => x.stud_id,
                        principalTable: "studs",
                        principalColumn: "stud_id");
                });

            migrationBuilder.CreateTable(
                name: "stud_phones",
                columns: table => new
                {
                    phone_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    stud_id = table.Column<int>(type: "integer", nullable: false),
                    phone_number = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_stud_phones", x => x.phone_id);
                    table.ForeignKey(
                        name: "fk_stud_phones_studs_stud_id",
                        column: x => x.stud_id,
                        principalTable: "studs",
                        principalColumn: "stud_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "auctions",
                columns: table => new
                {
                    auction_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    auction_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    insurance_details = table.Column<string>(type: "text", nullable: true),
                    location_id = table.Column<int>(type: "integer", nullable: true),
                    microchip_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_auctions", x => x.auction_id);
                    table.ForeignKey(
                        name: "fk_auctions_horse_profiles_microchip_id",
                        column: x => x.microchip_id,
                        principalTable: "horse_profiles",
                        principalColumn: "microchip_id");
                    table.ForeignKey(
                        name: "fk_auctions_locations_location_id",
                        column: x => x.location_id,
                        principalTable: "locations",
                        principalColumn: "location_id");
                });

            migrationBuilder.CreateTable(
                name: "health_records",
                columns: table => new
                {
                    health_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    diagnosis = table.Column<string>(type: "text", nullable: false),
                    treatment = table.Column<string>(type: "text", nullable: false),
                    visit_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: true),
                    microchip_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    vet_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_health_records", x => x.health_id);
                    table.ForeignKey(
                        name: "fk_health_records_equine_vets_vet_id",
                        column: x => x.vet_id,
                        principalTable: "equine_vets",
                        principalColumn: "vet_id");
                    table.ForeignKey(
                        name: "fk_health_records_horse_profiles_microchip_id",
                        column: x => x.microchip_id,
                        principalTable: "horse_profiles",
                        principalColumn: "microchip_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "horse_training_enrollments",
                columns: table => new
                {
                    enrollment_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    microchip_id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    program_id = table.Column<int>(type: "integer", nullable: false),
                    enrollment_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    performance_score = table.Column<int>(type: "integer", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_horse_training_enrollments", x => x.enrollment_id);
                    table.ForeignKey(
                        name: "fk_horse_training_enrollments_horse_profiles_microchip_id",
                        column: x => x.microchip_id,
                        principalTable: "horse_profiles",
                        principalColumn: "microchip_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_horse_training_enrollments_training_programmes_program_id",
                        column: x => x.program_id,
                        principalTable: "training_programmes",
                        principalColumn: "program_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_auctions_location_id",
                table: "auctions",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "ix_auctions_microchip_id",
                table: "auctions",
                column: "microchip_id");

            migrationBuilder.CreateIndex(
                name: "ix_health_records_microchip_id",
                table: "health_records",
                column: "microchip_id");

            migrationBuilder.CreateIndex(
                name: "ix_health_records_vet_id",
                table: "health_records",
                column: "vet_id");

            migrationBuilder.CreateIndex(
                name: "ix_horse_profiles_colour_id",
                table: "horse_profiles",
                column: "colour_id");

            migrationBuilder.CreateIndex(
                name: "ix_horse_profiles_owner_id",
                table: "horse_profiles",
                column: "owner_id");

            migrationBuilder.CreateIndex(
                name: "ix_horse_profiles_pedigree_ped_id",
                table: "horse_profiles",
                column: "pedigree_ped_id");

            migrationBuilder.CreateIndex(
                name: "ix_horse_profiles_stud_id",
                table: "horse_profiles",
                column: "stud_id");

            migrationBuilder.CreateIndex(
                name: "ix_horse_training_enrollments_microchip_id",
                table: "horse_training_enrollments",
                column: "microchip_id");

            migrationBuilder.CreateIndex(
                name: "ix_horse_training_enrollments_program_id",
                table: "horse_training_enrollments",
                column: "program_id");

            migrationBuilder.CreateIndex(
                name: "ix_maneges_location_id",
                table: "maneges",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "ix_stud_phones_stud_id",
                table: "stud_phones",
                column: "stud_id");

            migrationBuilder.CreateIndex(
                name: "ix_studs_location_id",
                table: "studs",
                column: "location_id");

            migrationBuilder.CreateIndex(
                name: "ix_training_programmes_manege_id",
                table: "training_programmes",
                column: "manege_id");

            migrationBuilder.CreateIndex(
                name: "ix_training_programmes_trainer_id",
                table: "training_programmes",
                column: "trainer_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "auctions");

            migrationBuilder.DropTable(
                name: "health_records");

            migrationBuilder.DropTable(
                name: "horse_training_enrollments");

            migrationBuilder.DropTable(
                name: "stud_phones");

            migrationBuilder.DropTable(
                name: "equine_vets");

            migrationBuilder.DropTable(
                name: "horse_profiles");

            migrationBuilder.DropTable(
                name: "training_programmes");

            migrationBuilder.DropTable(
                name: "colours");

            migrationBuilder.DropTable(
                name: "owners");

            migrationBuilder.DropTable(
                name: "pedigrees");

            migrationBuilder.DropTable(
                name: "studs");

            migrationBuilder.DropTable(
                name: "maneges");

            migrationBuilder.DropTable(
                name: "trainers");

            migrationBuilder.DropTable(
                name: "locations");

            migrationBuilder.DropColumn(
                name: "role",
                table: "users");
        }
    }
}

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddQueueSessionAndItsRelationsToSubjectAndUserThatCreated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QueueSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    ShortTitle = table.Column<string>(type: "text", nullable: false),
                    EventFormat = table.Column<int>(type: "integer", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: true),
                    MeetUrl = table.Column<string>(type: "text", nullable: true),
                    RegistrationStartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    QueueStartTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Duration = table.Column<TimeSpan>(type: "interval", nullable: false),
                    AverageMinutesPerStudent = table.Column<int>(type: "integer", nullable: false),
                    QueueStatus = table.Column<int>(type: "integer", nullable: false),
                    IsAllowedToSubmitMoreThanOne = table.Column<bool>(type: "boolean", nullable: false),
                    SubmissionMode = table.Column<int>(type: "integer", nullable: true),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QueueSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QueueSessions_AspNetUsers_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QueueSessions_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_QueueSessions_CreatedByUserId",
                table: "QueueSessions",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_QueueSessions_SubjectId",
                table: "QueueSessions",
                column: "SubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QueueSessions");
        }
    }
}

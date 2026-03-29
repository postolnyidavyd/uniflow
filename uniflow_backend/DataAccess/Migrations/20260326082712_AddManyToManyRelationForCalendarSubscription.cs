using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddManyToManyRelationForCalendarSubscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserEventSubscriptions",
                columns: table => new
                {
                    EventSubscriptionsId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubscribersId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserEventSubscriptions", x => new { x.EventSubscriptionsId, x.SubscribersId });
                    table.ForeignKey(
                        name: "FK_UserEventSubscriptions_AspNetUsers_SubscribersId",
                        column: x => x.SubscribersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserEventSubscriptions_Events_EventSubscriptionsId",
                        column: x => x.EventSubscriptionsId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserQueueSubscriptions",
                columns: table => new
                {
                    QueueSubscriptionsId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubscribersId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserQueueSubscriptions", x => new { x.QueueSubscriptionsId, x.SubscribersId });
                    table.ForeignKey(
                        name: "FK_UserQueueSubscriptions_AspNetUsers_SubscribersId",
                        column: x => x.SubscribersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserQueueSubscriptions_QueueSessions_QueueSubscriptionsId",
                        column: x => x.QueueSubscriptionsId,
                        principalTable: "QueueSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSubjectSubscriptions",
                columns: table => new
                {
                    SubjectSubscriptionsId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubscribersId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSubjectSubscriptions", x => new { x.SubjectSubscriptionsId, x.SubscribersId });
                    table.ForeignKey(
                        name: "FK_UserSubjectSubscriptions_AspNetUsers_SubscribersId",
                        column: x => x.SubscribersId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSubjectSubscriptions_Subjects_SubjectSubscriptionsId",
                        column: x => x.SubjectSubscriptionsId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserEventSubscriptions_SubscribersId",
                table: "UserEventSubscriptions",
                column: "SubscribersId");

            migrationBuilder.CreateIndex(
                name: "IX_UserQueueSubscriptions_SubscribersId",
                table: "UserQueueSubscriptions",
                column: "SubscribersId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSubjectSubscriptions_SubscribersId",
                table: "UserSubjectSubscriptions",
                column: "SubscribersId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserEventSubscriptions");

            migrationBuilder.DropTable(
                name: "UserQueueSubscriptions");

            migrationBuilder.DropTable(
                name: "UserSubjectSubscriptions");
        }
    }
}

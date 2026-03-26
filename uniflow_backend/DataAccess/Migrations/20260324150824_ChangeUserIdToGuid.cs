using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ChangeUserIdToGuid : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Використовуємо сирий SQL для виконання суворих правил PostgreSQL
            migrationBuilder.Sql(@"
        -- 1. Видаляємо всі Foreign Keys, які блокують зміну типу
        ALTER TABLE ""AspNetUserRoles"" DROP CONSTRAINT IF EXISTS ""FK_AspNetUserRoles_AspNetRoles_RoleId"";
        ALTER TABLE ""AspNetUserRoles"" DROP CONSTRAINT IF EXISTS ""FK_AspNetUserRoles_AspNetUsers_UserId"";
        ALTER TABLE ""AspNetUserClaims"" DROP CONSTRAINT IF EXISTS ""FK_AspNetUserClaims_AspNetUsers_UserId"";
        ALTER TABLE ""AspNetUserLogins"" DROP CONSTRAINT IF EXISTS ""FK_AspNetUserLogins_AspNetUsers_UserId"";
        ALTER TABLE ""AspNetUserTokens"" DROP CONSTRAINT IF EXISTS ""FK_AspNetUserTokens_AspNetUsers_UserId"";
        ALTER TABLE ""AspNetRoleClaims"" DROP CONSTRAINT IF EXISTS ""FK_AspNetRoleClaims_AspNetRoles_RoleId"";
        ALTER TABLE ""StudentWallets"" DROP CONSTRAINT IF EXISTS ""FK_StudentWallets_AspNetUsers_UserId"";

        -- 2. Конвертуємо колонки в uuid з використанням USING (магія Postgres)
        ALTER TABLE ""AspNetUsers"" ALTER COLUMN ""Id"" TYPE uuid USING ""Id""::uuid;
        ALTER TABLE ""AspNetRoles"" ALTER COLUMN ""Id"" TYPE uuid USING ""Id""::uuid;
        ALTER TABLE ""AspNetUserRoles"" ALTER COLUMN ""UserId"" TYPE uuid USING ""UserId""::uuid;
        ALTER TABLE ""AspNetUserRoles"" ALTER COLUMN ""RoleId"" TYPE uuid USING ""RoleId""::uuid;
        ALTER TABLE ""AspNetUserClaims"" ALTER COLUMN ""UserId"" TYPE uuid USING ""UserId""::uuid;
        ALTER TABLE ""AspNetUserLogins"" ALTER COLUMN ""UserId"" TYPE uuid USING ""UserId""::uuid;
        ALTER TABLE ""AspNetUserTokens"" ALTER COLUMN ""UserId"" TYPE uuid USING ""UserId""::uuid;
        ALTER TABLE ""AspNetRoleClaims"" ALTER COLUMN ""RoleId"" TYPE uuid USING ""RoleId""::uuid;
        ALTER TABLE ""StudentWallets"" ALTER COLUMN ""UserId"" TYPE uuid USING ""UserId""::uuid;

        -- 3. Відновлюємо Foreign Keys
        ALTER TABLE ""AspNetUserRoles"" ADD CONSTRAINT ""FK_AspNetUserRoles_AspNetRoles_RoleId"" FOREIGN KEY (""RoleId"") REFERENCES ""AspNetRoles"" (""Id"") ON DELETE CASCADE;
        ALTER TABLE ""AspNetUserRoles"" ADD CONSTRAINT ""FK_AspNetUserRoles_AspNetUsers_UserId"" FOREIGN KEY (""UserId"") REFERENCES ""AspNetUsers"" (""Id"") ON DELETE CASCADE;
        ALTER TABLE ""AspNetUserClaims"" ADD CONSTRAINT ""FK_AspNetUserClaims_AspNetUsers_UserId"" FOREIGN KEY (""UserId"") REFERENCES ""AspNetUsers"" (""Id"") ON DELETE CASCADE;
        ALTER TABLE ""AspNetUserLogins"" ADD CONSTRAINT ""FK_AspNetUserLogins_AspNetUsers_UserId"" FOREIGN KEY (""UserId"") REFERENCES ""AspNetUsers"" (""Id"") ON DELETE CASCADE;
        ALTER TABLE ""AspNetUserTokens"" ADD CONSTRAINT ""FK_AspNetUserTokens_AspNetUsers_UserId"" FOREIGN KEY (""UserId"") REFERENCES ""AspNetUsers"" (""Id"") ON DELETE CASCADE;
        ALTER TABLE ""AspNetRoleClaims"" ADD CONSTRAINT ""FK_AspNetRoleClaims_AspNetRoles_RoleId"" FOREIGN KEY (""RoleId"") REFERENCES ""AspNetRoles"" (""Id"") ON DELETE CASCADE;
        ALTER TABLE ""StudentWallets"" ADD CONSTRAINT ""FK_StudentWallets_AspNetUsers_UserId"" FOREIGN KEY (""UserId"") REFERENCES ""AspNetUsers"" (""Id"") ON DELETE CASCADE;
    ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "StudentWallets",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "AspNetUserTokens",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "AspNetUsers",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "RoleId",
                table: "AspNetUserRoles",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "AspNetUserRoles",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "AspNetUserLogins",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "AspNetUserClaims",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "AspNetRoles",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AlterColumn<string>(
                name: "RoleId",
                table: "AspNetRoleClaims",
                type: "text",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid");
        }
    }
}
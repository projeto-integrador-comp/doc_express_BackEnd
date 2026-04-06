import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRoleBasedOnAdmin1775423178976 implements MigrationInterface {
  name = "UpdateRoleBasedOnAdmin1775423178976";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'ADMIN' WHERE "admin" = true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to MONITOR for all, or based on role
    await queryRunner.query(
      `UPDATE "users" SET "role" = 'MONITOR' WHERE "role" = 'ADMIN'`,
    );
  }
}

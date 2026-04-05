import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAdminColumn1775423331358 implements MigrationInterface {
    name = 'RemoveAdminColumn1775423331358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "admin"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "admin" boolean NOT NULL DEFAULT false`);
    }

}

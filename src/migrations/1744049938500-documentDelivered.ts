import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentDelivered1744049938500 implements MigrationInterface {
    name = 'DocumentDelivered1744049938500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ADD "delivered" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "delivered"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultNoteColumn1743360350678 implements MigrationInterface {
    name = 'DefaultNoteColumn1743360350678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ALTER COLUMN "note" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" ALTER COLUMN "note" DROP DEFAULT`);
    }

}

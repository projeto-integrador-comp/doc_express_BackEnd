import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFilePathToFileUrl1758757501692
  implements MigrationInterface
{
  name = "ChangeFilePathToFileUrl1758757501692";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Adiciona fileUrl para Supabase
    await queryRunner.query(`
            ALTER TABLE "templates" 
            ADD COLUMN "fileUrl" VARCHAR(500);
        `);

    // 2. Remove filePath (não usamos mais caminho local)
    await queryRunner.query(`
            ALTER TABLE "templates" 
            DROP COLUMN "filePath";
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverte as alterações
        await queryRunner.query(`ALTER TABLE "templates" ADD COLUMN "filePath" VARCHAR`);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "fileUrl"`);
  }
}

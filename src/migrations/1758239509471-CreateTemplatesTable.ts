import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTemplatesTable1758239509471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "templates" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(50) NOT NULL,
        "description" character varying(255) NOT NULL,
        "fileName" character varying NOT NULL,
        "filePath" character varying NOT NULL,
        "fileSize" integer NOT NULL,
        "mimeType" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        
        -- Chave primária
        CONSTRAINT "PK_templates_id" PRIMARY KEY ("id"),
        
        -- Nome único por template ativo
        CONSTRAINT "UQ_template_name_active" UNIQUE NULLS NOT DISTINCT ("name", "isActive"),
        
        -- Validação de tamanho do arquivo (10MB)
        CONSTRAINT "CHK_file_size" CHECK (
          "fileSize" > 0 AND "fileSize" <= 10485760
        ),
        
        -- Validação de tipos de arquivo permitidos
        CONSTRAINT "CHK_mime_type" CHECK (
          "mimeType" IN (
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          )
        ),
        
        -- Validação de nome (5-50 caracteres)
        CONSTRAINT "CHK_name_length" CHECK (
          length("name") >= 5 AND length("name") <= 50
        ),
        
        -- Validação de descrição (1-255 caracteres)
        CONSTRAINT "CHK_description_length" CHECK (
          length("description") >= 1 AND length("description") <= 255
        )
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_templates_name" ON "templates" ("name");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_templates_mimeType" ON "templates" ("mimeType");
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_templates_isActive" ON "templates" ("isActive");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_templates_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_templates_mimeType"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_templates_isActive"`);

    await queryRunner.query(`DROP TABLE "templates"`);
  }
}

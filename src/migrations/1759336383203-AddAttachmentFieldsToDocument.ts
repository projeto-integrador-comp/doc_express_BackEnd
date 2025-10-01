import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttachmentFieldsToDocument1759336383203 implements MigrationInterface {
    name = 'AddAttachmentFieldsToDocument1759336383203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_templates_name"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_templates_mimeType"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_templates_isActive"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "CHK_file_size"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "CHK_mime_type"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "CHK_name_length"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "CHK_description_length"`);
        await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "UQ_template_name_active"`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "fileUrl" text`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "fileName" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "mimeType" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "fileSize" integer`);
        await queryRunner.query(`ALTER TABLE "documents" ADD "fileUploadedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "templates" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "templates" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "fileUploadedAt"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "fileSize"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "mimeType"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "fileName"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "fileUrl"`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "UQ_template_name_active" UNIQUE ("name", "isActive")`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "CHK_description_length" CHECK (((length((description)::text) >= 1) AND (length((description)::text) <= 255)))`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "CHK_name_length" CHECK (((length((name)::text) >= 5) AND (length((name)::text) <= 50)))`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "CHK_mime_type" CHECK ((("mimeType")::text = ANY ((ARRAY['application/pdf'::character varying, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'::character varying, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'::character varying])::text[])))`);
        await queryRunner.query(`ALTER TABLE "templates" ADD CONSTRAINT "CHK_file_size" CHECK ((("fileSize" > 0) AND ("fileSize" <= 10485760)))`);
        await queryRunner.query(`CREATE INDEX "IDX_templates_isActive" ON "templates" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_templates_mimeType" ON "templates" ("mimeType") `);
        await queryRunner.query(`CREATE INDEX "IDX_templates_name" ON "templates" ("name") `);
    }

}

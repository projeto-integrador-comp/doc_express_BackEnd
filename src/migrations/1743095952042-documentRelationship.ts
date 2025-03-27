import { MigrationInterface, QueryRunner } from "typeorm";

export class DocumentRelationship1743095952042 implements MigrationInterface {
    name = 'DocumentRelationship1743095952042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "submissionDate" date NOT NULL, "documentName" character varying(50) NOT NULL, "note" character varying(50) NOT NULL, "userId" uuid, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_e300b5c2e3fefa9d6f8a3f25975" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_e300b5c2e3fefa9d6f8a3f25975"`);
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}

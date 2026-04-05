import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClassroomStudentAttendanceTables1775423436652 implements MigrationInterface {
    name = 'CreateClassroomStudentAttendanceTables1775423436652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "classrooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "teacherId" uuid NOT NULL, CONSTRAINT "PK_20b7b82896c06eda27548bd0c24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attendances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "checkIn" TIMESTAMP, "checkOut" TIMESTAMP, "observation" character varying(255), "studentId" uuid NOT NULL, CONSTRAINT "PK_483ed97cd4cd43ab4a117516b69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(120) NOT NULL, "classroomId" uuid NOT NULL, CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "classroom_monitors" ("classroom_id" uuid NOT NULL, "monitor_id" uuid NOT NULL, CONSTRAINT "PK_98f6a9e42f6bd52f96b558bf132" PRIMARY KEY ("classroom_id", "monitor_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e939bf241e1edb52f058ef00c8" ON "classroom_monitors" ("classroom_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5c86f7fe313a1c0aaf6c13e53a" ON "classroom_monitors" ("monitor_id") `);
        await queryRunner.query(`ALTER TABLE "classrooms" ADD CONSTRAINT "FK_ea22bf3c6b069755e01340f6334" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attendances" ADD CONSTRAINT "FK_615b414059091a9a8ea0355ae89" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_e99293f4de5543838797d712b24" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "classroom_monitors" ADD CONSTRAINT "FK_e939bf241e1edb52f058ef00c83" FOREIGN KEY ("classroom_id") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "classroom_monitors" ADD CONSTRAINT "FK_5c86f7fe313a1c0aaf6c13e53af" FOREIGN KEY ("monitor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "classroom_monitors" DROP CONSTRAINT "FK_5c86f7fe313a1c0aaf6c13e53af"`);
        await queryRunner.query(`ALTER TABLE "classroom_monitors" DROP CONSTRAINT "FK_e939bf241e1edb52f058ef00c83"`);
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_e99293f4de5543838797d712b24"`);
        await queryRunner.query(`ALTER TABLE "attendances" DROP CONSTRAINT "FK_615b414059091a9a8ea0355ae89"`);
        await queryRunner.query(`ALTER TABLE "classrooms" DROP CONSTRAINT "FK_ea22bf3c6b069755e01340f6334"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5c86f7fe313a1c0aaf6c13e53a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e939bf241e1edb52f058ef00c8"`);
        await queryRunner.query(`DROP TABLE "classroom_monitors"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "attendances"`);
        await queryRunner.query(`DROP TABLE "classrooms"`);
    }

}

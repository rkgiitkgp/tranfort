import { MigrationInterface, QueryRunner } from 'typeorm';

export class companyVehicle1662850521453 implements MigrationInterface {
  name = 'companyVehicle1662850521453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "adhar_number" character varying NOT NULL, "pan_number" character varying NOT NULL, "company_address_id" character varying NOT NULL, "description" character varying, "category" character varying NOT NULL, CONSTRAINT "UQ_f296a7488ce93836ac47b799684" UNIQUE ("adhar_number"), CONSTRAINT "UQ_d8f0e70862655e7a4b229481007" UNIQUE ("pan_number"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "address_name" character varying NOT NULL, "city_id" character varying, "state_id" character varying, "zipcode_id" character varying, "company_id" uuid NOT NULL, CONSTRAINT "PK_1333bb935c62afe403dd22e5372" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "load_id" uuid NOT NULL, "confirmation" boolean NOT NULL DEFAULT false, "comments" character varying, CONSTRAINT "UQ_5f1b7c40dd283dc96d1ba72171f" UNIQUE ("load_id", "created_by"), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "load" ADD "assignee_id" uuid`);
    await queryRunner.query(
      `COMMENT ON COLUMN "load"."vehicle_requirement" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ALTER COLUMN "vehicle_requirement" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_address" ADD CONSTRAINT "FK_94eab1f5f65b2c641c0b5c4a067" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_fc175ac4de2d31fc4b0ebecead4" FOREIGN KEY ("load_id") REFERENCES "load"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_fc175ac4de2d31fc4b0ebecead4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company_address" DROP CONSTRAINT "FK_94eab1f5f65b2c641c0b5c4a067"`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ALTER COLUMN "vehicle_requirement" SET DEFAULT '{}'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "load"."vehicle_requirement" IS NULL`,
    );
    await queryRunner.query(`ALTER TABLE "load" DROP COLUMN "assignee_id"`);
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TABLE "company_address"`);
    await queryRunner.query(`DROP TABLE "company"`);
  }
}

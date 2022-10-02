import { MigrationInterface, QueryRunner } from 'typeorm';

export class removeCreatedBy1664692547438 implements MigrationInterface {
  name = 'removeCreatedBy1664692547438';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "company_address" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(`ALTER TABLE "line_item" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "load_address" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "load" DROP COLUMN "assignee_id"`);
    await queryRunner.query(`ALTER TABLE "load" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "state" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "zipcode" DROP COLUMN "updated_by"`);
    await queryRunner.query(`ALTER TABLE "city" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `ALTER TABLE "payment_term" DROP COLUMN "updated_by"`,
    );
    await queryRunner.query(`ALTER TABLE "vehicle" DROP COLUMN "updated_by"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "load"."vehicle_requirement" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "load"."vehicle_requirement" IS NULL`,
    );
    await queryRunner.query(`ALTER TABLE "vehicle" ADD "updated_by" uuid`);
    await queryRunner.query(`ALTER TABLE "payment_term" ADD "updated_by" uuid`);
    await queryRunner.query(`ALTER TABLE "city" ADD "updated_by" uuid`);
    await queryRunner.query(`ALTER TABLE "zipcode" ADD "updated_by" uuid`);
    await queryRunner.query(`ALTER TABLE "state" ADD "updated_by" uuid`);
    await queryRunner.query(`ALTER TABLE "booking" ADD "updated_by" uuid`);
    await queryRunner.query(`ALTER TABLE "load" ADD "updated_by" uuid`);
    await queryRunner.query(`ALTER TABLE "load" ADD "assignee_id" uuid`);
    await queryRunner.query(`ALTER TABLE "users" ADD "updated_by" uuid`);
    await queryRunner.query(`ALTER TABLE "load_address" ADD "updated_by" uuid`);
    await queryRunner.query(`ALTER TABLE "line_item" ADD "updated_by" uuid`);
    await queryRunner.query(
      `ALTER TABLE "company_address" ADD "updated_by" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "company" ADD "updated_by" uuid`);
  }
}

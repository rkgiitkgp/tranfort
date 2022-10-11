import { MigrationInterface, QueryRunner } from 'typeorm';

export class loadUpdate1665510242725 implements MigrationInterface {
  name = 'loadUpdate1665510242725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "line_item" DROP COLUMN "weight"`);
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP COLUMN "additional_measure_value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP COLUMN "weight_unit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP COLUMN "additional_measure_uom"`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD "uom" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD "value" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" ALTER COLUMN "sku" DROP NOT NULL`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "line_item"."sku" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "load" DROP COLUMN "vehicle_requirement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ADD "vehicle_requirement" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "load" DROP COLUMN "vehicle_requirement"`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ADD "vehicle_requirement" text array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(`COMMENT ON COLUMN "line_item"."sku" IS NULL`);
    await queryRunner.query(
      `ALTER TABLE "line_item" ALTER COLUMN "sku" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "line_item" DROP COLUMN "value"`);
    await queryRunner.query(`ALTER TABLE "line_item" DROP COLUMN "uom"`);
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD "additional_measure_uom" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD "weight_unit" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD "additional_measure_value" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD "weight" double precision`,
    );
  }
}

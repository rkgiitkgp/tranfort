import { MigrationInterface, QueryRunner } from 'typeorm';

export class advanceInPercentage1665511301119 implements MigrationInterface {
  name = 'advanceInPercentage1665511301119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "load" ADD "advance_in_percentage" double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ADD "additional_notes" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "load" DROP COLUMN "additional_notes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" DROP COLUMN "advance_in_percentage"`,
    );
  }
}

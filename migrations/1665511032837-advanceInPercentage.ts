import { MigrationInterface, QueryRunner } from 'typeorm';

export class advanceInPercentage1665511032837 implements MigrationInterface {
  name = 'advanceInPercentage1665511032837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "load" ADD "advance_in_percentage" double precision`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "load" DROP COLUMN "advance_in_percentage"`,
    );
  }
}

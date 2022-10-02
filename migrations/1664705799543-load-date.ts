import { MigrationInterface, QueryRunner } from 'typeorm';

export class loadDate1664705799543 implements MigrationInterface {
  name = 'loadDate1664705799543';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "load" ADD "start_date" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "load" ADD "end_date" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "load" DROP COLUMN "end_date"`);
    await queryRunner.query(`ALTER TABLE "load" DROP COLUMN "start_date"`);
  }
}

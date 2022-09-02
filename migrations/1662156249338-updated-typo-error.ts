import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatedTypoError1662156249338 implements MigrationInterface {
  name = 'updatedTypoError1662156249338';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "load" DROP COLUMN "sourch_address_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" DROP CONSTRAINT "FK_f1a95cf104bfbf9505ca4ef0a3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ALTER COLUMN "source_address_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "load"."source_address_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ADD CONSTRAINT "FK_f1a95cf104bfbf9505ca4ef0a3f" FOREIGN KEY ("source_address_id") REFERENCES "load_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "load" DROP CONSTRAINT "FK_f1a95cf104bfbf9505ca4ef0a3f"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "load"."source_address_id" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ALTER COLUMN "source_address_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ADD CONSTRAINT "FK_f1a95cf104bfbf9505ca4ef0a3f" FOREIGN KEY ("source_address_id") REFERENCES "load_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ADD "sourch_address_id" uuid NOT NULL`,
    );
  }
}

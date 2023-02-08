import { MigrationInterface, QueryRunner } from 'typeorm';

export class addressTable1675674445686 implements MigrationInterface {
  name = 'addressTable1675674445686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "company_address" CASCADE;`);

    await queryRunner.query(`DROP TABLE "company_address";`);
    await queryRunner.query(
      `CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "deleted" boolean NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "address_name" character varying NOT NULL, "city_id" character varying, "state_id" character varying, "zipcode_id" character varying, "entity_id" uuid NOT NULL, "type" character varying, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP COLUMN "company_address_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "company" ADD "company_address_id" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "address"`);
  }
}

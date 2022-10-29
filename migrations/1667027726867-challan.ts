import { MigrationInterface, QueryRunner } from 'typeorm';

export class challan1667027726867 implements MigrationInterface {
  name = 'challan1667027726867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "challan_line_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "deleted" boolean NOT NULL, "challan_id" uuid NOT NULL, "product_name" character varying NOT NULL, "sku" character varying, "uom" character varying, "value" double precision, CONSTRAINT "PK_239c3c9defa0a19e95eda7017d4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "challan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "deleted" boolean NOT NULL, "load_id" uuid NOT NULL, "booking_id" uuid NOT NULL, "driver_id" uuid NOT NULL, "vehicle" jsonb NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_97ca90eccf74612f57b102590da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "challan_line_item" ADD CONSTRAINT "FK_cfe1243af5162c8d4cc3cd433f5" FOREIGN KEY ("challan_id") REFERENCES "challan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "challan" ADD CONSTRAINT "FK_3c4c0ff7f08b31613d5d13c0313" FOREIGN KEY ("load_id") REFERENCES "load"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "vehicle"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "vehicle_number" character varying NOT NULL, "fuel_type" character varying NOT NULL, "model" character varying NOT NULL, "capacity" character varying NOT NULL, "age" character varying NOT NULL, "category" character varying NOT NULL, "container_type" character varying, CONSTRAINT "UQ_a3034dfd4663c5bb0d93b136a2e" UNIQUE ("vehicle_number"), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "challan" DROP CONSTRAINT "FK_3c4c0ff7f08b31613d5d13c0313"`,
    );
    await queryRunner.query(
      `ALTER TABLE "challan_line_item" DROP CONSTRAINT "FK_cfe1243af5162c8d4cc3cd433f5"`,
    );
    await queryRunner.query(`DROP TABLE "challan"`);
    await queryRunner.query(`DROP TABLE "challan_line_item"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class entities1662062262816 implements MigrationInterface {
  name = 'entities1662062262816';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "load_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "is_default" boolean NOT NULL DEFAULT false, "address_name" character varying NOT NULL, "city_id" uuid, "state_id" uuid, "zipcode_id" uuid, "country" character varying NOT NULL, "is_international" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_63ecf725e629c303a5e59b4c35d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "load" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "order_number" SERIAL NOT NULL, "sourch_address_id" uuid NOT NULL, "destination_address_id" uuid NOT NULL, "price_rate" double precision, "vehicle_requirement" text array NOT NULL DEFAULT '{}', "payment_term_id" uuid, "advance_payment" double precision, "total_price" double precision, "status" character varying NOT NULL, "source_address_id" uuid, CONSTRAINT "PK_296e0b3de93140af614a57b186b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "line_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "load_id" uuid NOT NULL, "product_name" character varying NOT NULL, "sku" character varying NOT NULL, "weight" double precision, "weight_unit" character varying, "additional_measure_uom" character varying, "additional_measure_value" double precision, CONSTRAINT "PK_cce6b13e67fa506d1d9618ac68b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "state" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "name" character varying NOT NULL, "gst" integer NOT NULL, CONSTRAINT "UQ_b2c4aef5929860729007ac32f6f" UNIQUE ("name"), CONSTRAINT "PK_549ffd046ebab1336c3a8030a12" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "zipcode" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "code" character varying NOT NULL, "city_id" uuid NOT NULL, CONSTRAINT "UQ_2122a830fd01a1c47f635de917c" UNIQUE ("code"), CONSTRAINT "PK_5ded4f9f0c3be366228e9abc5c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "name" character varying NOT NULL, "state_id" uuid NOT NULL, CONSTRAINT "UQ_f8c0858628830a35f19efdc0ecf" UNIQUE ("name"), CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_term" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "name" character varying NOT NULL, "due_date" integer, "type" character varying NOT NULL, CONSTRAINT "UQ_608cf9eab2726aee994f953b48c" UNIQUE ("name"), CONSTRAINT "PK_e06d6ccc9db17416919b5f46d6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ADD CONSTRAINT "FK_f1a95cf104bfbf9505ca4ef0a3f" FOREIGN KEY ("source_address_id") REFERENCES "load_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" ADD CONSTRAINT "FK_5b90ce40436c777422d12ca3005" FOREIGN KEY ("destination_address_id") REFERENCES "load_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" ADD CONSTRAINT "FK_b978c7c9730ca6e84099898e6df" FOREIGN KEY ("load_id") REFERENCES "load"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "zipcode" ADD CONSTRAINT "FK_20a57037f700851443bde4932ec" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_37ecd8addf395545dcb0242a593" FOREIGN KEY ("state_id") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_37ecd8addf395545dcb0242a593"`,
    );
    await queryRunner.query(
      `ALTER TABLE "zipcode" DROP CONSTRAINT "FK_20a57037f700851443bde4932ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "line_item" DROP CONSTRAINT "FK_b978c7c9730ca6e84099898e6df"`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" DROP CONSTRAINT "FK_5b90ce40436c777422d12ca3005"`,
    );
    await queryRunner.query(
      `ALTER TABLE "load" DROP CONSTRAINT "FK_f1a95cf104bfbf9505ca4ef0a3f"`,
    );
    await queryRunner.query(`DROP TABLE "payment_term"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "zipcode"`);
    await queryRunner.query(`DROP TABLE "state"`);
    await queryRunner.query(`DROP TABLE "line_item"`);
    await queryRunner.query(`DROP TABLE "load"`);
    await queryRunner.query(`DROP TABLE "load_address"`);
  }
}

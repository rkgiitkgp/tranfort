import {MigrationInterface, QueryRunner} from "typeorm";

export class vehicle1662029267925 implements MigrationInterface {
    name = 'vehicle1662029267925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vehicle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "vehicle_number" character varying NOT NULL, "fuel_type" character varying NOT NULL, "model" character varying NOT NULL, "capacity" character varying NOT NULL, "age" character varying NOT NULL, "category" character varying NOT NULL, "container_type" character varying, CONSTRAINT "UQ_a3034dfd4663c5bb0d93b136a2e" UNIQUE ("vehicle_number"), CONSTRAINT "PK_187fa17ba39d367e5604b3d1ec9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "vehicle"`);
    }

}

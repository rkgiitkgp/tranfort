import {MigrationInterface, QueryRunner} from "typeorm";

export class user1661616200990 implements MigrationInterface {
    name = 'user1661616200990'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "created_by" uuid, "updated_by" uuid, "deleted" boolean NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying, "mobile" character varying NOT NULL DEFAULT '9876543210', "type" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_d376a9f93bba651f32a2c03a7d3" UNIQUE ("mobile"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

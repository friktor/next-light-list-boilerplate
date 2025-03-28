import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1742909878478 implements MigrationInterface {
    name = 'Initial1742909878478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("id" uuid NOT NULL, "code" character varying(3) NOT NULL, "enabled" boolean NOT NULL, CONSTRAINT "PK_c2f67b45f0628aa06e9aec8ee5f" PRIMARY KEY ("id", "code"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "currency"`);
    }

}

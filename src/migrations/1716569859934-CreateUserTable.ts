import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1716569859934 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" character varying NOT NULL,
            "name" character varying NOT NULL,
            "password" character varying NOT NULL,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "users";
        `);
  }
}
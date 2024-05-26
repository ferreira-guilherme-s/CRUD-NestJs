import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1716569859934 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
        CREATE TABLE "users" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" character varying NOT NULL,
            "name" character varying NOT NULL,
            "password" character varying NOT NULL,
            "userType" character varying NOT NULL DEFAULT 'admin',
            "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
        );
    `);

    await queryRunner.query(`
    INSERT INTO "users" (email, name, password) VALUES
    ('admin@admin.com', 'User Admin', E'$2a$12$/i8TcYDoN3a43VXtsKnQ/OZaCz2qjpIP0ncJTdCLVjbrp4JMvJ3yu');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "users";
    `);
  }
}

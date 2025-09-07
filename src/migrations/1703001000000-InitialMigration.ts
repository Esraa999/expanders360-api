import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1703001000000 implements MigrationInterface {
  name = 'InitialMigration1703001000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`role\` enum ('client', 'admin') NOT NULL DEFAULT 'client',
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create clients table
    await queryRunner.query(`
      CREATE TABLE \`clients\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`companyName\` varchar(255) NOT NULL,
        \`contactEmail\` varchar(255) NOT NULL,
        \`phone\` varchar(255) NULL,
        \`address\` text NULL,
        \`website\` varchar(255) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`userId\` int NOT NULL,
        UNIQUE INDEX \`REL_99312d02a8b05e0b9b7c7e9e72\` (\`userId\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create vendors table
    await queryRunner.query(`
      CREATE TABLE \`vendors\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`description\` text NULL,
        \`countriesSupported\` json NOT NULL,
        \`servicesOffered\` json NOT NULL,
        \`rating\` decimal(3,2) NOT NULL DEFAULT '0.00',
        \`responseSlaHours\` int NOT NULL DEFAULT '24',
        \`contactEmail\` varchar(255) NULL,
        \`phone\` varchar(255) NULL,
        \`website\` varchar(255) NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE \`projects\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        \`country\` varchar(255) NOT NULL,
        \`servicesNeeded\` json NOT NULL,
        \`budget\` decimal(10,2) NOT NULL,
        \`status\` enum ('active', 'pending', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
        \`startDate\` datetime NULL,
        \`endDate\` datetime NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`clientId\` int NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create matches table
    await queryRunner.query(`
      CREATE TABLE \`matches\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`score\` decimal(5,2) NOT NULL,
        \`notes\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`projectId\` int NOT NULL,
        \`vendorId\` int NOT NULL,
        UNIQUE INDEX \`IDX_project_vendor\` (\`projectId\`, \`vendorId\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE \`clients\` ADD CONSTRAINT \`FK_99312d02a8b05e0b9b7c7e9e72f\` 
      FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_projects_client\` 
      FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_matches_project\` 
      FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_matches_vendor\` 
      FOREIGN KEY (\`vendorId\`) REFERENCES \`vendors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_matches_vendor\``);
    await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_matches_project\``);
    await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_projects_client\``);
    await queryRunner.query(`ALTER TABLE \`clients\` DROP FOREIGN KEY \`FK_99312d02a8b05e0b9b7c7e9e72f\``);
    
    await queryRunner.query(`DROP INDEX \`IDX_project_vendor\` ON \`matches\``);
    await queryRunner.query(`DROP TABLE \`matches\``);
    await queryRunner.query(`DROP TABLE \`projects\``);
    await queryRunner.query(`DROP TABLE \`vendors\``);
    await queryRunner.query(`DROP INDEX \`REL_99312d02a8b05e0b9b7c7e9e72\` ON \`clients\``);
    await queryRunner.query(`DROP TABLE \`clients\``);
    await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
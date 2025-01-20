import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class createDeclaration1631039612323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'declarations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'year',
            type: 'varchar',
          },
          {
            name: 'values',
            type: 'jsonb',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['UNSUBMITED', 'SUBMITED'],
            default: `'UNSUBMITED'`,
          },
          {
            name: 'user',
            type: 'uuid',
          },
          {
            name: 'rectified',
            type: 'uuid',
            isNullable: true
          },
          {
            name: 'has_rectified',
            type: 'boolean',
            default: false
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      })
    );
    await queryRunner.createForeignKey(
      'declarations',
      new TableForeignKey({
        columnNames: ['user'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
      })
    );
    await queryRunner.createForeignKey(
      'declarations',
      new TableForeignKey({
        columnNames: ['rectified'],
        referencedTableName: 'declarations',
        referencedColumnNames: ['id'],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('declarations');
  }
}

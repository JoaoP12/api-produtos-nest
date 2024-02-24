import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CriarTabelaCaracteristica1708559724657 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'caracteristica',
        columns: [
          {
            name: 'id_caracteristica',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_tipo_caracteristica',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_tipo_caracteristica'],
            referencedTableName: 'tipo_caracteristica',
            referencedColumnNames: ['id_tipo_caracteristica'],
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'caracteristica',
      new TableUnique({
        columnNames: ['id_caracteristica', 'id_tipo_caracteristica'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('caracateristica');
  }
}

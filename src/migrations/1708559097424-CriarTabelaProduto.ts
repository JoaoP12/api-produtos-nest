import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CriarTabelaProduto1708559097424 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'produto',
        columns: [
          {
            name: 'id_produto',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_tipo_produto',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'valor_unitario',
            type: 'int',
          },
          {
            name: 'descricao',
            type: 'text',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_tipo_produto'],
            referencedTableName: 'tipo_produto',
            referencedColumnNames: ['id_tipo_produto'],
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'produto',
      new TableUnique({
        columnNames: ['nome'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('produto');
  }
}

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CriarTabelaVenda1708560779865 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'venda',
        columns: [
          {
            name: 'id_venda',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_cliente',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'data_hora',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'valor_total',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'descricao',
            type: 'text',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_cliente'],
            referencedTableName: 'cliente',
            referencedColumnNames: ['id_cliente'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('venda');
  }
}

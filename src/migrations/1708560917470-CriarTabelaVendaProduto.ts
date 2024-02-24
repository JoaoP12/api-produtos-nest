import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CriarTabelaVendaProduto1708560917470 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'venda_produto',
        columns: [
          {
            name: 'id_venda',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'id_produto',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'valor_unitario',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'id_caracteristica',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'id_movimentacao_estoque',
            type: 'integer',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_venda'],
            referencedTableName: 'venda',
            referencedColumnNames: ['id_venda'],
          },
          {
            columnNames: ['id_produto'],
            referencedTableName: 'produto',
            referencedColumnNames: ['id_produto'],
          },
          {
            columnNames: ['id_caracteristica'],
            referencedTableName: 'caracteristica',
            referencedColumnNames: ['id_caracteristica'],
          },
          {
            columnNames: ['id_movimentacao_estoque'],
            referencedTableName: 'movimentacao_estoque',
            referencedColumnNames: ['id_movimentacao_estoque'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('venda_produto');
  }
}

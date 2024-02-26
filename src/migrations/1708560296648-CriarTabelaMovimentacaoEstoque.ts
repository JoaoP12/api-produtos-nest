import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CriarTabelaMovimentacaoEstoque1708560296648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'movimentacao_estoque',
        columns: [
          {
            name: 'id_movimentacao_estoque',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_produto',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'id_caracteristica',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'tipo_movimentacao_estoque',
            type: 'enum',
            enum: ['ENTRADA', 'SAIDA', 'AJUSTE'],
          },
          {
            name: 'quantidade',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'data_hora',
            type: 'timestamp',
            isNullable: false,
          },
        ],
        foreignKeys: [
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('movimentacao_estoque');
  }
}

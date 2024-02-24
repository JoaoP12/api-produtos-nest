import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CriarTabelaTipoMovimentacaoEstoque1708560292544 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tipo_movimentacao_estoque',
        columns: [
          {
            name: 'id_tipo_movimentacao_estoque',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'descricao',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'tipo_movimentacao_estoque',
      new TableUnique({
        columnNames: ['descricao'],
      }),
    );

    await queryRunner.query(
      `INSERT INTO tipo_movimentacao_estoque (descricao) VALUES ('ENTRADA'), ('VENDA'), ('AJUSTE'), ('DEVOLUCAO')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tipo_movimentacao_estoque');
  }
}

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
            name: 'nome_cliente',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'cpf_cliente',
            type: 'varchar',
            length: '11',
            isNullable: false,
          },
          {
            name: 'email_cliente',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'data_hora',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'valor_total',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'descricao',
            type: 'text',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('venda');
  }
}

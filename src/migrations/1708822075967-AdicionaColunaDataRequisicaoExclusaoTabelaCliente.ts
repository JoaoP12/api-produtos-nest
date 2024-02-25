import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AdicionaColunaDataRequisicaoExclusaoTabelaCliente1708822075967 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'cliente',
      new TableColumn({
        name: 'data_requisicao_exclusao',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('cliente', 'data_requisicao_exclusao');
  }
}

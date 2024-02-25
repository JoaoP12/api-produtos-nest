import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AdicionaColunaEmailNovoTabelaCliente1708819160328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'cliente',
      new TableColumn({
        name: 'email_novo',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );

    // create a timestamp column to check when the email was updated
    await queryRunner.addColumn(
      'cliente',
      new TableColumn({
        name: 'data_requisicao_email_novo',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('cliente', 'email_novo');
    await queryRunner.dropColumn('cliente', 'data_requisicao_email_novo');
  }
}

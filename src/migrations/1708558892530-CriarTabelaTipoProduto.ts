import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CriarTabelaTipoProduto1708558892530 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tipo_produto',
        columns: [
          {
            name: 'id_tipo_produto',
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
      'tipo_produto',
      new TableUnique({
        columnNames: ['descricao'],
      }),
    );

    await queryRunner.query(
      `INSERT INTO tipo_produto (descricao) VALUES ('Simples'), ('Configurável'), ('Digital'), ('Agrupado')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tipo_produto');
  }
}

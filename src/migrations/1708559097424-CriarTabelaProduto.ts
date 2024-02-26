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
            name: 'tipo_produto',
            type: 'enum',
            enum: ['SIMPLES', 'CONFIGURAVEL', 'DIGITAL', 'AGRUPADO'],
          },
          {
            name: 'nome',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'url_download',
            type: 'varchar',
            length: '255',
            isNullable: true,
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

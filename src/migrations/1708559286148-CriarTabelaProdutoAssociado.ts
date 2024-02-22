import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CriarTabelaProdutoAssociado1708559286148
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'produto_associado',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'id_produto',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'id_produto_associado',
            type: 'int',
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
            columnNames: ['id_produto_associado'],
            referencedTableName: 'produto',
            referencedColumnNames: ['id_produto'],
          },
        ],
      }),
    );

    await queryRunner.createUniqueConstraint(
      'produto_associado',
      new TableUnique({
        columnNames: ['id_produto', 'id_produto_associado'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('produto_associado');
  }
}

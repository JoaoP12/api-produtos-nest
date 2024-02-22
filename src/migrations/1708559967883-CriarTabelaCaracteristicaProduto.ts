import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CriarTabelaCaracteristicaProduto1708559967883
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'caracteristica_produto',
        columns: [
          {
            name: 'id_caracteristica',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'id_produto',
            type: 'integer',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_caracteristica'],
            referencedTableName: 'caracteristica',
            referencedColumnNames: ['id_caracteristica'],
          },
          {
            columnNames: ['id_produto'],
            referencedTableName: 'produto',
            referencedColumnNames: ['id_produto'],
          },
        ],
      }),
    );

    await queryRunner.createPrimaryKey('caracteristica_produto', [
      'id_caracteristica',
      'id_produto',
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('caracteristica_produto');
  }
}

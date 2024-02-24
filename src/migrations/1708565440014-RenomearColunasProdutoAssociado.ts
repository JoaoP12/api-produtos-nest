import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenomearColunasProdutoAssociado1708565440014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE produto_associado RENAME COLUMN id_produto_associado TO id_associado`);

    await queryRunner.query(`ALTER TABLE produto_associado RENAME COLUMN id TO id_produto_associado`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE produto_associado RENAME COLUMN id_produto_associado TO id`);

    await queryRunner.query(`ALTER TABLE produto_associado RENAME COLUMN id_associado TO id_produto_associado`);
  }
}

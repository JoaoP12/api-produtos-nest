import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'produto_associado' })
export class ProdutoAssociado {
  @PrimaryGeneratedColumn({ name: 'id_produto_associado' })
  idProdutoAssociado: number;

  @Column({ name: 'id_produto' })
  idProduto: number;

  @Column({ name: 'id_associado' })
  idAssociado: number;
}

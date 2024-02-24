import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'produto' })
export class Produto {
  @PrimaryGeneratedColumn({ name: 'id_produto' })
  idProduto: number;

  @Column({ name: 'id_tipo_produto' })
  idTipoProduto: number;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'valor_unitario' })
  valorUnitario?: number;

  @Column({ name: 'descricao' })
  descricao: string;
}

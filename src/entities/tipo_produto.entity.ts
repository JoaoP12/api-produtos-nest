import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tipo_produto' })
export class TipoProduto {
  @PrimaryGeneratedColumn({ name: 'id_tipo_produto' })
  idTipoProduto: number;

  @Column({ name: 'descricao' })
  descricao: string;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tipo_movimentacao_estoque' })
export class TipoMovimentacaoEstoque {
  @PrimaryGeneratedColumn({ name: 'id_tipo_movimentacao_estoque' })
  idTipoMovimentacaoEstoque: number;

  @Column({ name: 'descricao' })
  descricao: string;
}

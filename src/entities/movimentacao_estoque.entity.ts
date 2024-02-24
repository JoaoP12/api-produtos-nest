import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movimentacao_estoque' })
export class MovimentacaoEstoque {
  @PrimaryGeneratedColumn({ name: 'id_movimentacao_estoque' })
  idMovimentacaoEstoque: number;

  @Column({ name: 'id_produto' })
  idProduto: number;

  @Column({ name: 'id_caracteristica' })
  idCaracteristica: number;

  @Column({ name: 'id_tipo_movimentacao_estoque' })
  idTipoMovimentacaoEstoque: number;

  @Column({ name: 'quantidade' })
  quantidade: number;

  @Column({ name: 'data_hora' })
  dataHora: Date;
}

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TipoMovimentacaoEstoque } from '../modules/estoque/enum/tipoMovimentacaoEstoque.enum';

@Entity({ name: 'movimentacao_estoque' })
export class MovimentacaoEstoque {
  @PrimaryGeneratedColumn({ name: 'id_movimentacao_estoque' })
  idMovimentacaoEstoque: number;

  @Column({ name: 'id_produto' })
  idProduto: number;

  @Column({ name: 'id_caracteristica' })
  idCaracteristica?: number;

  @Column({ name: 'tipo_movimentacao_estoque', type: 'enum', enum: TipoMovimentacaoEstoque })
  tipoMovimentacaoEstoque: TipoMovimentacaoEstoque;

  @Column({ name: 'quantidade' })
  quantidade: number;

  @Column({ name: 'data_hora' })
  dataHora: Date;
}

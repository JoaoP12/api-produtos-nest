import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'venda_produto' })
export class VendaProduto {
  @PrimaryColumn({ name: 'id_venda' })
  idVenda: number;

  @PrimaryColumn({ name: 'id_produto' })
  idProduto: number;

  @Column({ name: 'valor_unitario' })
  valorUnitario: number;

  @Column({ name: 'quantidade' })
  quantidade: number;
}

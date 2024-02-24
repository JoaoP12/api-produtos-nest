import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'venda' })
export class Venda {
  @PrimaryGeneratedColumn({ name: 'id_venda' })
  idVenda: number;

  @Column({ name: 'id_cliente' })
  idCliente: number;

  @Column({ name: 'data_hora' })
  dataHora: Date;

  @Column({ name: 'valor_total' })
  valorTotal: number;

  @Column({ name: 'descricao' })
  descricao: string;
}

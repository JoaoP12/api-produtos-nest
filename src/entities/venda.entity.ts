import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'venda' })
export class Venda {
  @PrimaryGeneratedColumn({ name: 'id_venda' })
  idVenda: number;

  @Column({ name: 'nome_cliente' })
  nomeCliente: string;

  @Column({ name: 'cpf_cliente' })
  cpfCliente: string;

  @Column({ name: 'email_cliente' })
  emailCliente: string;

  @Column({ name: 'data_hora' })
  dataHora: Date;

  @Column({ name: 'valor_total' })
  valorTotal: number;

  @Column({ name: 'descricao' })
  descricao: string;
}

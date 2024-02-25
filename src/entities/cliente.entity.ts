import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cliente' })
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'id_cliente' })
  idCliente?: number;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'cpf' })
  cpf: string;

  @Column({ name: 'email_novo' })
  emailNovo?: string;

  @Column({ name: 'data_requisicao_email_novo' })
  dataRequisicaoEmailNovo?: Date;

  @Column({ name: 'data_requisicao_exclusao' })
  dataRequisicaoExclusao?: Date;
}

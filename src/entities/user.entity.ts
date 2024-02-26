import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser?: number;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'email' })
  email: string;
}

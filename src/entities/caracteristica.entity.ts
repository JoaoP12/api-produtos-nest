import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Caracteristica {
  @PrimaryGeneratedColumn({ name: 'id_caracteristica' })
  idCaracteristica: number;

  @Column({ name: 'id_tipo_caracteristica' })
  idTipoCaracteristica: number;

  @Column({ name: 'nome' })
  nome: string;
}

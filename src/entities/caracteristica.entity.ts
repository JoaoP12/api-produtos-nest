import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Caracteristica {
  @PrimaryGeneratedColumn({ name: 'id_caracteristica' })
  id_caracteristica: number;

  @Column({ name: 'id_tipo_caracteristica' })
  id_tipo_caracteristica: number;

  @Column({ name: 'descricao' })
  descricao: string;
}

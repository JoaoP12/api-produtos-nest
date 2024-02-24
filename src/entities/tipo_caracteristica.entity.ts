import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tipo_caracteristica' })
export class TipoCaracteristica {
  @PrimaryGeneratedColumn({ name: 'id_tipo_caracteristica' })
  idTipoCaracteristica: number;

  @Column({ name: 'nome' })
  nome: string;
}

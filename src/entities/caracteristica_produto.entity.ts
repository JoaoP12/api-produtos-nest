import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'caracteristica_produto' })
export class CaracteristicaProduto {
  @PrimaryColumn({ name: 'id_produto' })
  idProduto: number;

  @PrimaryColumn({ name: 'id_caracteristica' })
  idCaracteristica: number;
}

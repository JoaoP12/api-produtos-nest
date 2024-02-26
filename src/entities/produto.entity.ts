import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TipoProduto } from '../modules/produto/enum/tipoProduto.enum';

@Entity({ name: 'produto' })
export class Produto {
  @PrimaryGeneratedColumn({ name: 'id_produto' })
  idProduto?: number;

  @Column({ name: 'tipo_produto', type: 'enum', enum: TipoProduto })
  tipoProduto: TipoProduto;

  @Column({ name: 'nome' })
  nome: string;

  @Column({ name: 'url_download' })
  urlDownload?: string;

  @Column({ name: 'valor_unitario' })
  valorUnitario?: number;

  @Column({ name: 'descricao' })
  descricao: string;
}

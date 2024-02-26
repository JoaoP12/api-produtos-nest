import { ProdutoDTO } from '../../src/modules/produto/dto/produto.dto';
import { TipoProduto } from '../../src/modules/produto/enum/tipoProduto.enum';

export function getProdutoTeste(): ProdutoDTO {
  return {
    nome: 'Produto teste',
    tipoProduto: TipoProduto.SIMPLES,
    descricao: 'Este é um produto de teste',
    valorUnitario: 100,
  };
}

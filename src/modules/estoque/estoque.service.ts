import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimentacaoEstoque } from '../../entities/movimentacao_estoque.entity';
import { MovimentacaoEstoqueDTO } from './dto/movimentacaoEstoque.dto';
import { ProdutoService } from '../produto/produto.service';
import { TipoProduto } from '../produto/enum/tipoProduto.enum';
import { TipoMovimentacaoEstoque } from './enum/tipoMovimentacaoEstoque.enum';
import { CaracteristicaService } from '../produto/caracteristica.service';

@Injectable()
export class EstoqueService {
  constructor(
    @InjectRepository(MovimentacaoEstoque)
    private movimentacaoEstoqueRepository: Repository<MovimentacaoEstoque>,
    private readonly produtoService: ProdutoService,
    private readonly caracteristicaService: CaracteristicaService,
  ) {}

  async consultarEstoqueAtualProduto(idProduto: number, idCaracteristica?: number): Promise<number> {
    const qtdAtual = await this.movimentacaoEstoqueRepository.sum('quantidade', { idProduto, idCaracteristica });
    return qtdAtual ?? 0;
  }

  async cadastrarMovimentacao(movimentacao: MovimentacaoEstoqueDTO): Promise<MovimentacaoEstoque> {
    const { idProduto, idCaracteristica, quantidade, tipoMovimentacaoEstoque } = movimentacao;
    const tipoProduto = await this.produtoService.getTipoProduto(idProduto);

    if (tipoProduto === TipoProduto.CONFIGURAVEL && idCaracteristica == null) {
      throw new BadRequestException('Produto configurável deve ter uma característica');
    }
    const caracteristica = await this.caracteristicaService.verificaExistenciaCaracteristicaProduto(
      idCaracteristica,
      idProduto,
    );
    if (idCaracteristica && !caracteristica) {
      throw new NotFoundException(`Característica não encontrada para o produto`);
    }

    if (quantidade === 0) {
      throw new BadRequestException('A quantidade da movimentação deve ser diferente de 0');
    }

    if (quantidade < 0 && tipoMovimentacaoEstoque === TipoMovimentacaoEstoque.ENTRADA) {
      throw new BadRequestException('A quantidade do tipo de movimentação "Entrada" deve ser positiva');
    }

    if (quantidade > 0 && tipoMovimentacaoEstoque === TipoMovimentacaoEstoque.SAIDA) {
      throw new BadRequestException('A quantidade do tipo de movimentação "Saída" deve ser negativa');
    }

    const qtdEstoque = await this.consultarEstoqueAtualProduto(idProduto, idCaracteristica);
    if (tipoMovimentacaoEstoque === TipoMovimentacaoEstoque.SAIDA && Math.abs(quantidade) > qtdEstoque) {
      throw new BadRequestException('A quantidade da movimentação é maior que o estoque atual');
    }

    const movimentacaoEstoque = await this.movimentacaoEstoqueRepository.save({
      idProduto,
      idCaracteristica,
      quantidade,
      tipoMovimentacaoEstoque,
      dataHora: new Date(),
    });

    return movimentacaoEstoque;
  }

  async listarMovimentacoesProduto(idProduto: number): Promise<MovimentacaoEstoque[]> {
    return await this.movimentacaoEstoqueRepository.find({ where: { idProduto }, order: { dataHora: 'DESC' } });
  }
}

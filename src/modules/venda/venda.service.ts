import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { DataSource, Repository } from 'typeorm';
import { MovimentacaoEstoque } from '../../entities/movimentacao_estoque.entity';
import { Produto } from '../../entities/produto.entity';
import { Venda } from '../../entities/venda.entity';
import { VendaProduto } from '../../entities/venda_produto.entity';
import { TipoMovimentacaoEstoque } from '../estoque/enum/tipoMovimentacaoEstoque.enum';
import { EstoqueService } from '../estoque/estoque.service';
import { CaracteristicaService } from '../produto/caracteristica.service';
import { ProdutoService } from '../produto/produto.service';
import { ItemDTO, VendaDTO } from './dto/venda.dto';
import { TipoProduto } from '../produto/enum/tipoProduto.enum';

@Injectable()
export class VendaService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Venda)
    private vendaRepository: Repository<Venda>,
    @InjectRepository(VendaProduto)
    private vendaProdutoRepository: Repository<VendaProduto>,
    private readonly produtoService: ProdutoService,
    private readonly caracteristicaService: CaracteristicaService,
    private readonly estoqueService: EstoqueService,
  ) {}

  async consultarVenda(idVenda: number) {
    const venda = await this.vendaRepository.findOne({ where: { idVenda } });

    if (!venda) {
      throw new NotFoundException('Venda não encontrada');
    }

    return await this.getVendaFormatada(venda);
  }

  async listarVendas(): Promise<object[]> {
    const vendas = await this.vendaRepository.find();
    return await Promise.all(vendas.map(async (venda) => await this.getVendaFormatada(venda)));
  }

  async getVendaFormatada(venda: Venda): Promise<object> {
    const produtosVenda = await this.consultarProdutosVenda(venda.idVenda);
    const produtos: object[] = [];
    for (const produtoVenda of produtosVenda) {
      const produto = await this.produtoService.consultarPorId(produtoVenda.idProduto);
      produtos.push(produto);
    }

    const cpf = venda.cpfCliente;
    const cpfFormatado = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
    return {
      id: venda.idVenda,
      data_venda: format(venda.dataHora, 'yyyy-MM-dd HH:mm:ss'),
      descricao: venda.descricao,
      valor_total: venda.valorTotal,
      cliente: {
        nome: venda.nomeCliente,
        email: venda.emailCliente,
        cpf: cpfFormatado,
      },
      itens: produtos.map((produto, index) => ({
        ...produto,
        quantidade: produtosVenda[index].quantidade,
        valor_unitario: produtosVenda[index].valorUnitario,
        valor_total: produtosVenda[index].valorUnitario * produtosVenda[index].quantidade,
      })),
    };
  }

  async consultarProdutosVenda(idVenda: number): Promise<VendaProduto[]> {
    return await this.vendaProdutoRepository.find({ where: { idVenda } });
  }

  async cadastrarVenda(venda: VendaDTO): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      let vendaResult = new Venda();
      vendaResult.cpfCliente = venda.cliente.cpf;
      vendaResult.emailCliente = venda.cliente.email;
      vendaResult.nomeCliente = venda.cliente.nome;
      vendaResult.descricao = venda.descricao;
      vendaResult.valorTotal = 0;
      vendaResult.dataHora = new Date();
      vendaResult = await manager.save(vendaResult);

      const { vendaProdutos, movimentacoes } = await this.processarItensVenda(vendaResult.idVenda, venda.itens);

      const valorTotal = vendaProdutos.map((venda) => venda.valorUnitario * venda.quantidade).reduce((a, b) => a + b);
      vendaResult.valorTotal = valorTotal;
      await manager.save(Venda, vendaResult);
      const movimentacoesSalvas = await manager.save(MovimentacaoEstoque, movimentacoes);

      for (let i = 0; i < vendaProdutos.length; i++) {
        vendaProdutos[i].idMovimentacaoEstoque = movimentacoesSalvas[i].idMovimentacaoEstoque;
      }

      await manager.save(VendaProduto, vendaProdutos);
    });
  }

  private async processarItensVenda(idVenda: number, itens: ItemDTO[]): Promise<any> {
    const movimentacoes: MovimentacaoEstoque[] = [];
    const vendaProdutos: VendaProduto[] = [];
    for (const item of itens) {
      const produto = (await this.produtoService.consultarPorId(item.idProduto)) as Produto;
      if (!produto) {
        throw new NotFoundException(`Produto com id ${item.idProduto} não encontrado`);
      }

      const tipoProduto = await this.produtoService.getTipoProduto(item.idProduto);
      if (tipoProduto === TipoProduto.CONFIGURAVEL && item.idCaracteristica == null) {
        throw new BadRequestException('Produto configurável deve ter uma característica');
      }

      const caracteristica = await this.caracteristicaService.verificaExistenciaCaracteristicaProduto(
        item.idCaracteristica,
        item.idProduto,
      );
      if (item.idCaracteristica && !caracteristica) {
        throw new NotFoundException(`Característica não encontrada para o produto ${produto.nome}`);
      }

      const qtdAtual = await this.estoqueService.consultarEstoqueAtualProduto(item.idProduto, item.idCaracteristica);
      const qtdVenda = item.quantidade;
      if (qtdAtual < qtdVenda) {
        throw new BadRequestException(`Quantidade insuficiente em estoque para o produto "${produto.nome}"`);
      }

      const vendaProduto = new VendaProduto();
      vendaProduto.idVenda = idVenda;
      vendaProduto.idProduto = item.idProduto;
      vendaProduto.idCaracteristica = item.idCaracteristica;
      vendaProduto.quantidade = qtdVenda;
      vendaProduto.valorUnitario = produto.valorUnitario;
      vendaProdutos.push(vendaProduto);

      movimentacoes.push({
        idProduto: item.idProduto,
        idCaracteristica: item.idCaracteristica,
        quantidade: -qtdVenda,
        tipoMovimentacaoEstoque: TipoMovimentacaoEstoque.SAIDA,
        dataHora: new Date(),
      } as MovimentacaoEstoque);
    }

    return {
      vendaProdutos,
      movimentacoes,
    };
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { Caracteristica } from '../../entities/caracteristica.entity';
import { CaracteristicaProduto } from '../../entities/caracteristica_produto.entity';
import { Produto } from '../../entities/produto.entity';
import { ProdutoAssociado } from '../../entities/produto_associado.entity';
import { CaracteristicaService } from './caracteristica.service';
import { AtualizarProdutoDTO } from './dto/atualizarProduto.dto';
import { ProdutoDTO } from './dto/produto.dto';
import { TipoProduto } from './enum/tipoProduto.enum';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
    @InjectRepository(ProdutoAssociado)
    private produtoAssociadoRepository: Repository<ProdutoAssociado>,
    private readonly caracteristicaService: CaracteristicaService,
  ) {}

  async consultarProduto(idProduto: number): Promise<object> {
    const produto = await this.produtoRepository.findOne({ where: { idProduto } });
    return await this.formatarRetornoProduto(produto);
  }

  private async formatarRetornoProduto(produto: Produto): Promise<object> {
    const funcaoRetornoProduto = {
      [TipoProduto.SIMPLES]: this.formatarRetornoProdutoSimplesDigital.bind(this),
      [TipoProduto.DIGITAL]: this.formatarRetornoProdutoSimplesDigital.bind(this),
      [TipoProduto.CONFIGURAVEL]: this.formatarRetornoProdutoConfiguravel.bind(this),
      [TipoProduto.AGRUPADO]: this.formatarRetornoProdutoAgrupado.bind(this),
    };

    return await funcaoRetornoProduto[produto.tipoProduto](produto);
  }

  private async formatarRetornoProdutoSimplesDigital(produto: Produto): Promise<object> {
    if (produto.tipoProduto === TipoProduto.DIGITAL) {
      return produto;
    }

    const obj = { ...produto };
    delete obj['urlDownload'];
    return obj;
  }

  private async formatarRetornoProdutoConfiguravel(produto: Produto): Promise<object> {
    const caracteristicasFormatadas = await this.produtoRepository
      .createQueryBuilder('p')
      .select([
        'tc.id_tipo_caracteristica as "idTipoCaracteristica"',
        'tc.nome as "tipoCaracteristica"',
        'c.id_caracteristica as "idCaracteristica"',
        'c.nome as "nome"',
      ])
      .innerJoin('caracteristica_produto', 'cp', 'cp.id_produto = p.id_produto')
      .innerJoin('caracteristica', 'c', 'c.id_caracteristica = cp.id_caracteristica')
      .innerJoin('tipo_caracteristica', 'tc', 'tc.id_tipo_caracteristica = c.id_tipo_caracteristica')
      .where('p.id_produto = :idProduto', { idProduto: produto.idProduto })
      .getRawMany();

    return { ...produto, caracteristicas: caracteristicasFormatadas };
  }

  private async formatarRetornoProdutoAgrupado(produto: Produto): Promise<object> {
    const produtosAssociadosFormatados = await this.produtoRepository
      .createQueryBuilder('p')
      .select(['associado.id_produto as "idProduto"', 'associado.nome as "nome"', 'associado.descricao as "descricao"'])
      .innerJoin('produto_associado', 'pa', 'pa.id_produto = p.id_produto')
      .innerJoin('produto', 'associado', 'associado.id_produto = pa.id_associado')
      .where('p.id_produto = :idProduto', { idProduto: produto.idProduto })
      .getRawMany();

    return { ...produto, produtosAssociados: produtosAssociadosFormatados };
  }

  async listarProdutos(): Promise<Produto[]> {
    const produtos = await this.produtoRepository.find();
    const produtosRetorno = [];
    for (const produto of produtos) {
      produtosRetorno.push(await this.formatarRetornoProduto(produto));
    }
    return produtosRetorno;
  }

  async cadastrarProduto(produto: ProdutoDTO) {
    const produtoExistente = await this.produtoRepository.exists({ where: { nome: produto.nome } });
    if (produtoExistente) {
      throw new BadRequestException('Já existe um produto com esse nome');
    }

    if (produto.tipoProduto !== TipoProduto.DIGITAL) {
      produto['urlDownload'] = null;
    }

    if (produto.tipoProduto !== TipoProduto.CONFIGURAVEL) {
      delete produto['caracteristicas'];
    }

    if (produto.tipoProduto !== TipoProduto.AGRUPADO) {
      delete produto['produtosAssociados'];
    }

    const funcaoCadastro = {
      [TipoProduto.SIMPLES]: this.cadastrarProdutoSimplesDigital.bind(this),
      [TipoProduto.DIGITAL]: this.cadastrarProdutoSimplesDigital.bind(this),
      [TipoProduto.CONFIGURAVEL]: this.cadastrarProdutoConfiguravel.bind(this),
      [TipoProduto.AGRUPADO]: this.cadastrarProdutoAgrupado.bind(this),
    };

    return await funcaoCadastro[produto.tipoProduto](produto);
  }

  private async cadastrarProdutoSimplesDigital(produto: ProdutoDTO): Promise<Produto> {
    return await this.produtoRepository.save(produto as Produto);
  }

  private async cadastrarProdutoConfiguravel(produto: ProdutoDTO): Promise<object> {
    const idsCaracteristicas: number[] = produto.caracteristicas;
    delete produto['caracteristicas'];
    let produtoResult: Produto = new Produto();

    const caracteristicasProduto: Caracteristica[] = [];
    await this.dataSource.transaction(async (manager) => {
      produtoResult.nome = produto.nome;
      produtoResult.valorUnitario = produto.valorUnitario;
      produtoResult.descricao = produto.descricao;
      produtoResult.tipoProduto = produto.tipoProduto;

      produtoResult = await manager.save(produtoResult);

      for (const idCaracteristica of idsCaracteristicas) {
        const caracteristica = await this.caracteristicaService.consultarCaracteristicaPorId(idCaracteristica);
        if (!caracteristica) {
          throw new BadRequestException(`Característica com id ${idCaracteristica} não encontrada`);
        }

        const caracteristicaProduto = new CaracteristicaProduto();
        caracteristicaProduto.idCaracteristica = idCaracteristica;
        caracteristicaProduto.idProduto = produtoResult.idProduto;

        await manager.save(caracteristicaProduto);
        caracteristicasProduto.push(caracteristica);
      }
    });

    return { ...produtoResult, caracteristicas: caracteristicasProduto };
  }

  private async cadastrarProdutoAgrupado(produto: ProdutoDTO): Promise<object> {
    const idsProdutos: number[] = produto.produtosAssociados;
    delete produto['produtosAssociados'];
    let produtoResult: Produto = new Produto();

    const produtosAssociados: Produto[] = [];
    await this.dataSource.transaction(async (manager) => {
      produtoResult.nome = produto.nome;
      produtoResult.valorUnitario = produto.valorUnitario;
      produtoResult.descricao = produto.descricao;
      produtoResult.tipoProduto = produto.tipoProduto;

      produtoResult = await manager.save(produtoResult);

      for (const idAssociado of idsProdutos) {
        const produtoAssociado = await manager
          .getRepository(Produto)
          .findOne({ where: { idProduto: idAssociado, tipoProduto: TipoProduto.SIMPLES } });

        if (!produtoAssociado) {
          throw new BadRequestException(
            `Produto associado com id ${idAssociado} não foi encontrado ou não é um produto do tipo SIMPLES`,
          );
        }

        let associado = await manager
          .getRepository(ProdutoAssociado)
          .findOne({ where: { idAssociado, idProduto: produtoResult.idProduto } });

        if (associado) {
          throw new BadRequestException(`Produto com id ${idAssociado} já está associado ao produto`);
        }

        associado = new ProdutoAssociado();
        associado.idProduto = produtoResult.idProduto;
        associado.idAssociado = idAssociado;

        await manager.save(associado);
        produtosAssociados.push(produtoAssociado);
      }
    });

    return { ...produtoResult, produtosAssociados: produtosAssociados };
  }

  async atualizarProduto(produto: AtualizarProdutoDTO) {
    const produtoResult = await this.produtoRepository.findOne({ where: { idProduto: produto.idProduto } });
    if (!produtoResult) {
      throw new BadRequestException('Produto não encontrado');
    }

    if (produto.nome !== null && (await this.produtoRepository.exists({ where: { nome: ILike(produto.nome) } }))) {
      throw new BadRequestException(`Já existe um produto com o nome ${produto.nome}`);
    }

    if (produtoResult.tipoProduto !== TipoProduto.DIGITAL) {
      produto['urlDownload'] = null;
    }

    return await this.produtoRepository.save({ ...produtoResult, ...produto });
  }

  async adicionarCaracteristicaProduto(idCaracteristica: number, idProduto: number): Promise<void> {
    const produto = await this.produtoRepository.findOne({
      where: { idProduto, tipoProduto: TipoProduto.CONFIGURAVEL },
    });
    if (!produto) {
      throw new BadRequestException('Produto não encontrado ou não é do tipo CONFIGURAVEL');
    }

    const caracteristica = await this.caracteristicaService.consultarCaracteristicaPorId(idCaracteristica);
    if (!caracteristica) {
      throw new NotFoundException('Característica não encontrada');
    }

    if (await this.caracteristicaService.verificaExistenciaCaracteristicaProduto(idCaracteristica, idProduto)) {
      throw new BadRequestException('Característica já associada ao produto');
    }

    await this.caracteristicaService.salvarCaracteristicaProduto(idCaracteristica, idProduto);
  }

  async removerCaracteristica(idCaracteristica: number, idProduto: number): Promise<void> {
    const caracteristicaProdutoExistente = await this.caracteristicaService.verificaExistenciaCaracteristicaProduto(
      idCaracteristica,
      idProduto,
    );

    if (!caracteristicaProdutoExistente) {
      throw new NotFoundException('Característica do produto não encontrado');
    }

    const numCaracteristicas = await this.caracteristicaService.consultarNumeroCaracteristicasProduto(idProduto);
    if (numCaracteristicas <= 2) {
      throw new BadRequestException(
        'Não é possível remover a característica. O produto deve ter no mínimo 2 características.',
      );
    }

    await this.caracteristicaService.removerCaracteristicaProduto(idCaracteristica, idProduto);
  }

  async associarProdutoAgrupado(idAssociado: number, idProduto: number): Promise<void> {
    const produtoAgrupado = await this.produtoRepository.findOne({
      where: { idProduto, tipoProduto: TipoProduto.AGRUPADO },
    });

    if (!produtoAgrupado) {
      throw new NotFoundException('Produto agrupado não encontrado');
    }

    const associado = await this.produtoRepository.findOne({
      where: { idProduto: idAssociado, tipoProduto: TipoProduto.SIMPLES },
    });

    if (!associado) {
      throw new NotFoundException('Produto não encontrado ou não é um produto do tipo SIMPLES');
    }

    if (await this.produtoAssociadoRepository.exists({ where: { idAssociado, idProduto } })) {
      throw new BadRequestException('Produto já associado ao produto agrupado');
    }

    const produtoAssociado = new ProdutoAssociado();
    produtoAssociado.idProduto = idProduto;
    produtoAssociado.idAssociado = idAssociado;

    await this.produtoAssociadoRepository.save(produtoAssociado);
  }

  async desassociarProdutoAgrupado(idAssociado: number, idProduto: number): Promise<void> {
    const produtoAgrupado = await this.produtoRepository.findOne({
      where: { idProduto, tipoProduto: TipoProduto.AGRUPADO },
    });

    if (!produtoAgrupado) {
      throw new NotFoundException('Produto agrupado não encontrado');
    }

    if (!(await this.produtoAssociadoRepository.exists({ where: { idAssociado, idProduto } }))) {
      throw new NotFoundException('Produto não associado ao produto agrupado');
    }

    const numAssociados = await this.produtoAssociadoRepository.count({ where: { idProduto } });
    if (numAssociados <= 2) {
      throw new BadRequestException(
        'Não é possível desassociar o produto. O produto agrupado deve ter no mínimo 2 produtos associados.',
      );
    }

    await this.produtoAssociadoRepository.delete({ idAssociado, idProduto });
  }

  async getTipoProduto(idProduto: number): Promise<TipoProduto> {
    const produto = await this.produtoRepository.findOne({ where: { idProduto } });
    return produto.tipoProduto;
  }

  async consultarPorId(idProduto: number, formatObject: boolean = false): Promise<Produto | object> {
    const produto = await this.produtoRepository.findOne({ where: { idProduto } });
    if (formatObject) {
      return await this.formatarRetornoProduto(produto);
    }

    return produto;
  }
}

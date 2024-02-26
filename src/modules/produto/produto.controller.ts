import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { AtualizarProdutoDTO } from './dto/atualizarProduto.dto';
import { CaracteristicaProdutoDTO } from './dto/caracteristicaProduto.dto';
import { ConsultarProdutoDTO } from './dto/consultarProduto.dto';
import { ProdutoDTO } from './dto/produto.dto';
import { ProdutoAssociadoDTO } from './dto/produtoAssociado.dto';
import { ProdutoService } from './produto.service';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Produto } from '../../entities/produto.entity';

@Controller('produto')
@UseGuards(AuthGuard)
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @ApiParam({ name: 'idProduto', type: 'number', description: 'Id do produto' })
  @ApiTags('Produto')
  @ApiResponse({
    status: 200,
    description: 'Consulta produto cadastrado',
    type: Produto,
  })
  @Get('consultar/:idProduto')
  consultarProduto(@Param() { idProduto }: ConsultarProdutoDTO) {
    return this.produtoService.consultarProduto(idProduto);
  }

  @ApiTags('Produto')
  @ApiResponse({
    status: 200,
    description: 'Lista produtos cadastrados',
    type: Array<Produto>,
  })
  @Get('listar')
  listarProdutos() {
    return this.produtoService.listarProdutos();
  }

  @ApiBody({ type: ProdutoDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 201,
    description: 'Cadastra novo produto',
    type: Produto,
  })
  @HttpCode(201)
  @Post('cadastrar')
  cadastrarProduto(@Body() produto: ProdutoDTO) {
    return this.produtoService.cadastrarProduto(produto);
  }

  @ApiBody({ type: AtualizarProdutoDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 200,
    description: 'Atualiza produto especificado',
    type: Produto,
  })
  @Put('atualizar')
  atualizarProduto(@Body() produto: AtualizarProdutoDTO) {
    return this.produtoService.atualizarProduto(produto);
  }

  @ApiBody({ type: CaracteristicaProdutoDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 201,
    description: 'Adiciona caracteristica ao produto',
    type: Object,
  })
  @HttpCode(201)
  @Post('caracteristica-produto/adicionar')
  async adicionarCaracteristica(@Body() { idProduto, idCaracteristica }: CaracteristicaProdutoDTO) {
    await this.produtoService.adicionarCaracteristicaProduto(idCaracteristica, idProduto);
    return {
      message: 'Caracteristica adicionada ao produto com sucesso',
    };
  }

  @ApiBody({ type: CaracteristicaProdutoDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 204,
    description: 'Remove caracteristica do produto',
  })
  @HttpCode(204)
  @Delete('caracteristica-produto/remover')
  async removerCaracteristica(@Body() { idProduto, idCaracteristica }: CaracteristicaProdutoDTO) {
    await this.produtoService.removerCaracteristica(idCaracteristica, idProduto);
  }

  @ApiBody({ type: ProdutoAssociadoDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 201,
    description: 'Associa produto ao produto agrupado',
    type: Object,
  })
  @HttpCode(201)
  @Post('agrupado/associar')
  async associarProdutoAgrupado(@Body() { idAssociado, idProduto }: ProdutoAssociadoDTO) {
    await this.produtoService.associarProdutoAgrupado(idAssociado, idProduto);
    return {
      message: 'Produto associado com sucesso',
    };
  }

  @ApiBody({ type: ProdutoAssociadoDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 204,
    description: 'Desassocia produto do produto agrupado',
  })
  @HttpCode(204)
  @Delete('agrupado/desassociar')
  async desassociarProdutoAgrupado(@Body() { idAssociado, idProduto }: ProdutoAssociadoDTO) {
    await this.produtoService.desassociarProdutoAgrupado(idAssociado, idProduto);
  }
}

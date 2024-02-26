import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MovimentacaoEstoque } from '../../entities/movimentacao_estoque.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { ConsultarProdutoDTO } from '../produto/dto/consultarProduto.dto';
import { MovimentacaoEstoqueDTO } from './dto/movimentacaoEstoque.dto';
import { EstoqueService } from './estoque.service';

@Controller('estoque')
@UseGuards(AuthGuard)
export class EstoqueController {
  constructor(private readonly estoqueService: EstoqueService) {}

  @ApiParam({ name: 'idProduto', type: 'number' })
  @ApiTags('Estoque')
  @ApiResponse({
    status: 200,
    description: 'Consulta quantidade em estoque atual do produto',
    type: Object,
  })
  @Get('consultar/:idProduto')
  async consultarEstoqueAtualProduto(@Param() { idProduto }: ConsultarProdutoDTO) {
    const estoqueAtual = await this.estoqueService.consultarEstoqueAtualProduto(idProduto);
    return { idProduto, estoqueAtual };
  }

  @ApiBody({ type: MovimentacaoEstoqueDTO })
  @ApiTags('Estoque')
  @ApiResponse({
    status: 201,
    description: 'Cadastra uma nova movimentação de estoque',
    type: MovimentacaoEstoque,
  })
  @HttpCode(201)
  @Post('movimentacao/cadastro')
  async cadastrarMovimentacao(@Body() movimentacao: MovimentacaoEstoqueDTO) {
    return this.estoqueService.cadastrarMovimentacao(movimentacao);
  }

  @ApiParam({ name: 'idProduto', type: 'number' })
  @ApiTags('Estoque')
  @ApiResponse({
    status: 201,
    description: 'Consulta as movimentações de estoque de um produto',
    type: Array<MovimentacaoEstoque>,
  })
  @Get('movimentacao/produto/:idProduto')
  async listarMovimentacoesProduto(@Param() { idProduto }: ConsultarProdutoDTO) {
    return this.estoqueService.listarMovimentacoesProduto(idProduto);
  }
}

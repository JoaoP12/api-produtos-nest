import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { ConsultarVendaDTO } from './dto/consultarVenda.dto';
import { VendaDTO } from './dto/venda.dto';
import { VendaService } from './venda.service';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Venda } from '../../entities/venda.entity';

@Controller('venda')
@UseGuards(AuthGuard)
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @ApiParam({ name: 'idVenda', type: 'number', description: 'Id da venda' })
  @ApiTags('Venda')
  @ApiResponse({
    status: 200,
    description: 'Consulta a venda especificada',
    type: Venda,
  })
  @Get('consultar/:idVenda')
  consultarVenda(@Param() { idVenda }: ConsultarVendaDTO) {
    return this.vendaService.consultarVenda(idVenda);
  }

  @ApiTags('Venda')
  @ApiResponse({
    status: 200,
    description: 'Lista as vendas cadastradas',
    type: Array<Venda>,
  })
  @Get('listar')
  listarVendas() {
    return this.vendaService.listarVendas();
  }

  @ApiBody({ type: VendaDTO })
  @ApiTags('Venda')
  @ApiResponse({
    status: 201,
    description: 'Cadastra uma nova venda',
    type: Venda,
  })
  @HttpCode(201)
  @Post('cadastrar')
  cadastrarVenda(@Body() venda: VendaDTO) {
    return this.vendaService.cadastrarVenda(venda);
  }
}

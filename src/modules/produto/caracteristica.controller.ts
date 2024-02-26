import { Body, Controller, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { CaracteristicaService } from './caracteristica.service';
import { AtualizarCaracteristicaDTO } from './dto/atualizarCaracteristica.dto';
import { AtualizarTipoCaracteristicaDTO } from './dto/atualizarTipoCaracteristica.dto';
import { CaracteristicaDTO } from './dto/caracteristica.dto';
import { ConsultarCaracteristicasDTO } from './dto/consultarCaracteristicas.dto';
import { TipoCaracteristicaDTO } from './dto/tipoCaracteristica.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TipoCaracteristica } from '../../entities/tipo_caracteristica.entity';
import { Caracteristica } from '../../entities/caracteristica.entity';

@Controller('produto/caracteristica')
@UseGuards(AuthGuard)
export class CaracteristicaController {
  constructor(private readonly caracteristicaService: CaracteristicaService) {}

  @ApiTags('Produto')
  @ApiResponse({
    status: 200,
    description: 'Listagem dos tipos de caracteristica cadastrados no sistema',
    type: Array<TipoCaracteristica>,
  })
  @Get('tipo/listar')
  listarTiposCaracteristicas() {
    return this.caracteristicaService.listarTiposCaracteristicas();
  }

  @ApiBody({ type: AtualizarTipoCaracteristicaDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 200,
    description: 'Atualiza nome do tipo de característica especificado',
    type: TipoCaracteristica,
  })
  @Put('tipo/atualizar')
  atualizarTipoCaracteristica(@Body() tipoCaracteristica: AtualizarTipoCaracteristicaDTO) {
    return this.caracteristicaService.atualizarTipoCaracteristica(tipoCaracteristica);
  }

  @ApiBody({ type: TipoCaracteristicaDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 201,
    description: 'Cadastra novo tipo de característica',
    type: TipoCaracteristica,
  })
  @HttpCode(201)
  @Post('tipo/cadastrar')
  cadastrarTipoCaracteristica(@Body() tipoCaracteristica: TipoCaracteristicaDTO) {
    return this.caracteristicaService.cadastrarTipoCaracteristica(tipoCaracteristica);
  }

  @ApiParam({ name: 'idTipoCaracteristica', type: 'number', description: 'Id do tipo de característica' })
  @ApiTags('Produto')
  @ApiResponse({
    status: 200,
    description: 'Lista características para o idTipoCaracteristica especificado',
    type: Array<Caracteristica>,
  })
  @Get('listar/:idTipoCaracteristica')
  listarCaracteristicas(@Param() { idTipoCaracteristica }: ConsultarCaracteristicasDTO) {
    return this.caracteristicaService.listarCaracteristicas(idTipoCaracteristica);
  }

  @ApiBody({ type: CaracteristicaDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 201,
    description: 'Cadastra nova característica',
    type: Caracteristica,
  })
  @HttpCode(201)
  @Post('cadastrar')
  cadastrarCaracteristica(@Body() caracteristica: CaracteristicaDTO) {
    return this.caracteristicaService.cadastrarCaracteristica(caracteristica);
  }

  @ApiBody({ type: AtualizarCaracteristicaDTO })
  @ApiTags('Produto')
  @ApiResponse({
    status: 200,
    description: 'Atualiza característica especificada',
    type: Caracteristica,
  })
  @Put('atualizar')
  atualizarCaracteristica(@Body() caracteristica: AtualizarCaracteristicaDTO) {
    return this.caracteristicaService.atualizarCaracteristica(caracteristica);
  }
}

import { Body, Controller, Delete, Get, HttpCode, Patch, Post, Req } from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { ClienteService } from './cliente.service';
import { ClienteDTO } from './dto/cliente.dto';
import { Request } from 'express';
import { UpdateEmailClienteDTO, UpdateNomeClienteDTO } from './dto/updateCliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @HttpCode(201)
  @Public()
  @Post('cadastrar')
  async cadastrar(@Body() cliente: ClienteDTO) {
    const clienteResult = this.clienteService.cadastrar(cliente);
    return clienteResult;
  }

  @Get('consultar')
  async consultar(@Req() request: Request) {
    const userEmail = request['userEmail'];
    const cliente = await this.clienteService.consultarPorEmail(userEmail);
    return cliente;
  }

  @HttpCode(202)
  @Delete('excluir')
  async excluir(@Req() request: Request) {
    const userEmail = request['userEmail'];
    const { idCliente } = await this.clienteService.consultarPorEmail(userEmail);
    await this.clienteService.requisitarExclusao(idCliente);
    return { message: 'Confirme a exclusão através do link enviado para sua caixa de entrada' };
  }

  @HttpCode(202)
  @Patch('atualizar/email')
  async atualizarEmail(@Req() request: Request, @Body() { email }: UpdateEmailClienteDTO) {
    const userEmail = request['userEmail'];
    const { idCliente } = await this.clienteService.consultarPorEmail(userEmail);
    await this.clienteService.requisitarAtualizacaoEmail(idCliente, email);
    return {
      message: 'Confirme a alteração do novo email através do link enviado para sua caixa de entrada',
    };
  }

  @Patch('atualizar/nome')
  async atualizarNome(@Req() request: Request, @Body() { nome }: UpdateNomeClienteDTO) {
    const userEmail = request['userEmail'];
    const { idCliente } = await this.clienteService.consultarPorEmail(userEmail);
    await this.clienteService.atualizarNome(idCliente, nome);
    return { message: 'Nome atualizado com sucesso' };
  }
}

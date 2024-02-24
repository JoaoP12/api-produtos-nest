import { Body, Controller, Post } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteDTO } from './dto/cliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post('cadastrar')
  async cadastrar(@Body() cliente: ClienteDTO) {
    const clienteResult = this.clienteService.cadastrar(cliente);
    return clienteResult;
  }
}

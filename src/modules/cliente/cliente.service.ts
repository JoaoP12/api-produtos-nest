import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Cliente } from '../../entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente) private clienteRepository: Repository<Cliente>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async cadastrar(clienteReq: Cliente): Promise<Cliente> {
    const { email, cpf, nome } = clienteReq;
    const emailCadastrado = await this.clienteRepository.findOne({ where: { email } });
    const cpfCadastrado = await this.clienteRepository.findOne({ where: { cpf } });

    if (emailCadastrado) {
      throw new BadRequestException('Email já foi cadastrado');
    }

    if (cpfCadastrado) {
      throw new BadRequestException('CPF já foi cadastrado');
    }

    const cliente: Cliente = await this.clienteRepository.save({ email, cpf, nome });
    await this.authService.sendMagicLink(email);
    return cliente;
  }

  async consultarPorEmailCpf(email: string, cpf: string): Promise<Cliente> {
    return await this.clienteRepository.findOne({ where: { email, cpf } });
  }

  async consultarPorEmail(email: string): Promise<Cliente> {
    return await this.clienteRepository.findOne({ where: { email } });
  }
}

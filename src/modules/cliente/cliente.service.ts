import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { Cliente } from '../../entities/cliente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente) private clienteRepository: Repository<Cliente>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async limparRequisicaoEmailsNovos() {
    // Limpa as requisições de alteração de email que não foram confirmadas em 24 horas
    const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const clientes = await this.clienteRepository.find({
      where: {
        emailNovo: Not(IsNull()),
        dataRequisicaoEmailNovo: LessThan(oneDayAgo),
      },
    });

    clientes.forEach((cliente) => {
      cliente.emailNovo = null;
      cliente.dataRequisicaoEmailNovo = null;
    });

    await this.clienteRepository.save(clientes);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async limparRequisicaoExclusao() {
    // Limpa as requisições de exclusão que não foram confirmadas em 24 horas
    const oneDayAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
    const clientes = await this.clienteRepository.find({
      where: {
        dataRequisicaoExclusao: LessThan(oneDayAgo),
      },
    });

    clientes.forEach((cliente) => {
      cliente.dataRequisicaoExclusao = null;
    });

    await this.clienteRepository.save(clientes);
  }

  async cadastrar(clienteReq: Cliente): Promise<Cliente> {
    const { email, cpf, nome } = clienteReq;
    const emailDisponivel = await this.isEmailDisponivel(email);
    const cpfCadastrado = await this.clienteRepository.findOne({ where: { cpf } });

    if (!emailDisponivel) {
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

  async isEmailDisponivel(email: string): Promise<boolean> {
    return !(await this.clienteRepository.exists({
      where: [{ email }, { emailNovo: email }],
    }));
  }

  async requisitarAtualizacaoEmail(idCliente: number, emailNovo: string): Promise<void> {
    const emailDisponivel = await this.isEmailDisponivel(emailNovo);

    if (!emailDisponivel) {
      throw new BadRequestException('Email indisponível');
    }

    const cliente = await this.clienteRepository.findOne({ where: { idCliente } });
    cliente.emailNovo = emailNovo;
    cliente.dataRequisicaoEmailNovo = new Date();
    await this.clienteRepository.save(cliente);
    await this.authService.sendEmailChangeConfirmationLink(cliente.email, emailNovo);
  }

  async efetivarAtualizacaoEmail(email: string, emailNovo: string): Promise<void> {
    const cliente = await this.clienteRepository.findOne({ where: { email, emailNovo } });

    if (!cliente) {
      throw new BadRequestException('Emails não encontrados');
    }

    cliente.email = emailNovo;
    cliente.emailNovo = null;
    cliente.dataRequisicaoEmailNovo = null;
    await this.clienteRepository.save(cliente);
  }

  async atualizarNome(idCliente: number, nome: string): Promise<void> {
    const cliente = await this.clienteRepository.findOne({ where: { idCliente } });
    cliente.nome = nome;
    await this.clienteRepository.save(cliente);
  }

  async requisitarExclusao(idCliente: number): Promise<void> {
    const cliente = await this.clienteRepository.findOne({ where: { idCliente } });
    cliente.dataRequisicaoExclusao = new Date();
    await this.clienteRepository.save(cliente);
    await this.authService.sendAccountDeletionConfirmationLink(cliente.email);
  }

  async efetivarExclusao(idCliente: number): Promise<void> {
    // Por causa da constraint ON DELETE SET NULL, as vendas vinculadas ao cliente serão desvinculadas, mas continuarão existindo
    await this.clienteRepository.delete({ idCliente });
  }
}

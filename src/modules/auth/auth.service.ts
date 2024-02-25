import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClienteService } from '../cliente/cliente.service';
import { MailService } from '../mailer/mail.service';
import { JwtExpiration } from './enum/jwtExpiration.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly clienteService: ClienteService,
  ) {}

  async authenticate(email: string, cpf: string): Promise<void> {
    const cliente = await this.clienteService.consultarPorEmailCpf(email, cpf);

    if (cliente) {
      await this.sendMagicLink(email);
    }
  }

  async validateLoginToken(token: string): Promise<string> {
    try {
      const { email } = await this.jwtService.verify(token, { secret: process.env.MAGIC_LINK_SECRET });
      const cliente = await this.clienteService.consultarPorEmail(email);

      if (!cliente) {
        throw new UnauthorizedException();
      }

      const sessionJwtToken = this.generateToken(
        { id: cliente.idCliente, email: cliente.email },
        process.env.JWT_SECRET,
        JwtExpiration.ONE_DAY,
      );

      return sessionJwtToken;
    } catch (verificationError) {
      throw new UnauthorizedException();
    }
  }

  async sendMagicLink(email: string): Promise<void> {
    // TODO: adicionar retry e tratamento de erro
    const token = this.generateToken({ email }, process.env.MAGIC_LINK_SECRET, JwtExpiration.FIFTEEN_MINUTES);
    const magicLink = `${process.env.APPLICATION_URL}/auth/login/validate/${token}`;
    this.mailService
      .sendMail({
        from: '"API Produtos" <api.produtos@email.com>"',
        to: email,
        subject: 'Link de autenticação - API de Produtos',
        text: `Faça login usando o link abaixo:

        ${magicLink}

        O link expirará em 15 minutos.
        **Não forneça este link a ninguém**`,
      })
      .catch((error) => {
        console.error('Erro ao enviar email de autenticação', error);
      });
  }

  async sendEmailChangeConfirmationLink(email: string, emailNovo: string): Promise<void> {
    const token = this.generateToken({ email, emailNovo }, process.env.MAGIC_LINK_SECRET, JwtExpiration.ONE_DAY);
    const magicLink = `${process.env.APPLICATION_URL}/auth/email/confirm/${token}`;
    this.mailService.sendMail({
      from: '"API Produtos" <api.produtos@email.com>',
      to: emailNovo,
      subject: 'Confirme seu novo email - API de Produtos',
      text: `Confirme a alteração de email usando o link abaixo:

        ${magicLink}

        O link expirará em 24 horas.
        **Não forneça este link a ninguém**`,
    });
  }

  async confirmEmailChange(token: string): Promise<void> {
    try {
      const { email, emailNovo } = await this.jwtService.verify(token, { secret: process.env.MAGIC_LINK_SECRET });
      const clienteExiste = await this.clienteService.consultarPorEmail(email);

      if (!clienteExiste) {
        throw new NotFoundException();
      }

      await this.clienteService.efetivarAtualizacaoEmail(email, emailNovo);
    } catch (verificationError) {
      throw new UnauthorizedException();
    }
  }

  async sendAccountDeletionConfirmationLink(email: string): Promise<void> {
    const token = this.generateToken({ email }, process.env.MAGIC_LINK_SECRET, JwtExpiration.ONE_DAY);
    const magicLink = `${process.env.APPLICATION_URL}/auth/delete/confirm/${token}`;
    this.mailService.sendMail({
      from: '"API Produtos" <api.produtos@email.com>',
      to: email,
      subject: 'Confirme a exclusão da sua conta - API de Produtos',
      text: `Confirme a exclusão da sua conta usando o link abaixo:

        ${magicLink}

        O link expirará em 24 horas.
        **Não forneça este link a ninguém**`,
    });
  }

  async confirmAccountDeletion(token: string): Promise<void> {
    try {
      const { email } = await this.jwtService.verify(token, { secret: process.env.MAGIC_LINK_SECRET });
      const cliente = await this.clienteService.consultarPorEmail(email);

      if (!cliente) {
        throw new NotFoundException();
      }

      if (cliente.dataRequisicaoExclusao == null) {
        throw new BadRequestException('Não há solicitação de exclusão para este email.');
      }

      await this.clienteService.efetivarExclusao(cliente.idCliente);

      this.mailService.sendMail({
        from: '"API Produtos" <api.produtos@email.com>',
        to: email,
        subject: 'Conta excluída - API de Produtos',
        text: `Sua conta foi excluída com sucesso.`,
      });
    } catch (verificationError) {
      throw new UnauthorizedException();
    }
  }

  generateToken(payload: any, secret: string, expiresIn: JwtExpiration): string {
    return this.jwtService.sign(payload, { secret, expiresIn: expiresIn });
  }
}

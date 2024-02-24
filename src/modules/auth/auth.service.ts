import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MailService } from '../mailer/mail.service';
import { JwtService } from '@nestjs/jwt';
import { ClienteService } from '../cliente/cliente.service';

enum JwtExpiration {
  ONE_DAY = '1d',
  FIFTEEN_MINUTES = '15m',
}

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
      const { email } = await this.jwtService.verify(token, { secret: process.env.MAGIC_LOGIN_SECRET });
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
    const token = this.generateToken({ email }, process.env.MAGIC_LOGIN_SECRET, JwtExpiration.FIFTEEN_MINUTES);
    const magicLink = `${process.env.APPLICATION_URL}/auth/login/validate/${token}`;
    this.mailService.sendMail({
      from: '"API Produtos" <api.produtos@email.com>"',
      to: email,
      subject: 'Link de autenticação - API de Produtos',
      text: `Faça login usando o link abaixo:

        ${magicLink}

        O link expirará em 15 minutos.
        **Não forneça este link a ninguém**`,
    });
  }

  generateToken(payload: any, secret: string, expiresIn: JwtExpiration): string {
    return this.jwtService.sign(payload, { secret, expiresIn: expiresIn });
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mailer/mail.service';
import { UserService } from '../user/user.service';
import { JwtExpiration } from './enum/jwtExpiration.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async authenticate(email: string): Promise<void> {
    const user = await this.userService.consultarPorEmail(email);

    if (user) {
      await this.sendMagicLink(email);
    }
  }

  async validateLoginToken(token: string): Promise<string> {
    try {
      const { email } = await this.jwtService.verify(token, { secret: process.env.MAGIC_LINK_SECRET });
      const user = await this.userService.consultarPorEmail(email);

      if (!user) {
        throw new UnauthorizedException();
      }

      const sessionJwtToken = this.generateToken(
        { id: user.idUser, email: user.email },
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

  generateToken(payload: any, secret: string, expiresIn: JwtExpiration): string {
    return this.jwtService.sign(payload, { secret, expiresIn: expiresIn });
  }
}

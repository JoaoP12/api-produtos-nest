import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MAILER_TRANSPORT } from './utils/consts';

@Injectable()
export class MailService {
  constructor(
    @Inject(MAILER_TRANSPORT)
    private readonly mailerTransport: Transporter,
  ) {}

  async sendMail(mailOptions: Mail.Options): Promise<any> {
    return await this.mailerTransport.sendMail(mailOptions);
  }
}

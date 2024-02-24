import { Module } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { MAILER_TRANSPORT } from './utils/consts';
import { MailService } from './mail.service';

@Module({
  providers: [
    {
      provide: MAILER_TRANSPORT,
      useFactory: () => createTransport({ url: process.env.MAILER_CONFIG_URL }),
    },
    MailService,
  ],
  exports: [MailService],
})
export class MailModule {}

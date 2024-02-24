import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClienteModule } from '../cliente/cliente.module';
import { MailModule } from '../mailer/mail.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../guards/auth.guard';

@Module({
  imports: [JwtModule.register({}), MailModule, forwardRef(() => ClienteModule)],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

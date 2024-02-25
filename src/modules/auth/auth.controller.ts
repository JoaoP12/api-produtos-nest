import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { Public } from '../../decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { JwtValidationDTO } from './dto/validateLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() { email, cpf }: LoginDTO) {
    this.authService.authenticate(email, cpf);
    return {
      message: 'Se existir uma conta com os dados informados, um link de autenticação será enviado por email.',
    };
  }

  @Public()
  @HttpCode(201)
  @Get('login/validate/:token')
  async validateLogin(@Param() { token }: JwtValidationDTO) {
    const jwtToken = await this.authService.validateLoginToken(token);
    return { token: jwtToken };
  }

  @Public()
  @Get('email/confirm/:token')
  async confirmEmail(@Param() { token }: JwtValidationDTO) {
    await this.authService.confirmEmailChange(token);
    return { message: 'Email confirmado com sucesso. Você já pode fazer login' };
  }

  @Public()
  @Get('delete/confirm/:token')
  async confirmExclusao(@Param() { token }: JwtValidationDTO) {
    await this.authService.confirmAccountDeletion(token);
    return { message: 'Conta excluída com sucesso' };
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { LoginValidationDTO } from './dto/validateLogin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, cpf }: LoginDTO) {
    this.authService.authenticate(email, cpf);
    return {
      message: 'Se existir uma conta com os dados informados, um link de autenticação será enviado por email.',
    };
  }

  @Get('login/validate/:token')
  async validateLogin(@Param() { token }: LoginValidationDTO) {
    const jwtToken = await this.authService.validateLoginToken(token);
    return { token: jwtToken };
  }
}
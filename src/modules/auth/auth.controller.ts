import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { JwtValidationDTO } from './dto/validateLogin.dto';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDTO })
  @ApiTags('Auth')
  @ApiResponse({
    status: 200,
    description: 'Inicia o processo de autenticação do usuario',
    type: Object,
  })
  @Post('login')
  async login(@Body() { email }: LoginDTO) {
    this.authService.authenticate(email);
    return {
      message: 'Se existir uma conta com os dados informados, um link de autenticação será enviado por email.',
    };
  }

  @ApiParam({ name: 'token', type: 'string', description: 'Token de autenticação' })
  @ApiTags('Auth')
  @ApiResponse({
    status: 200,
    description: 'Faz a autenticação do usuario com base no magic link',
    type: Object,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  @HttpCode(201)
  @Get('login/validate/:token')
  async validateLogin(@Param() { token }: JwtValidationDTO) {
    const jwtToken = await this.authService.validateLoginToken(token);
    return { token: jwtToken };
  }
}

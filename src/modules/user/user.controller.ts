import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../../decorators/public.decorator';
import { User } from '../../entities/user.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: UserDTO })
  @ApiTags('User')
  @ApiResponse({
    status: 201,
    description: 'Cadastra um novo usuário',
    type: User,
  })
  @Public()
  @HttpCode(201)
  @Post('cadastrar')
  async cadastrar(@Body() user: UserDTO) {
    const userResult = this.userService.cadastrar(user);
    return userResult;
  }

  @ApiTags('User')
  @ApiResponse({
    status: 200,
    description: 'Consulta os dados do usuário logado',
    type: User,
  })
  @UseGuards(AuthGuard)
  @Get('consultar')
  async consultar(@Req() request: Request) {
    const userEmail = request['userEmail'];
    const user = await this.userService.consultarPorEmail(userEmail);
    return user;
  }
}

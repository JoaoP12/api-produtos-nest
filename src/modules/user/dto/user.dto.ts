import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserDTO {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'Email do usuário',
  })
  @IsEmail()
  @MaxLength(100, { message: 'O email deve ter no máximo 100 caracteres' })
  email: string;
}

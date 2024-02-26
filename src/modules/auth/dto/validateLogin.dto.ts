import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class JwtValidationDTO {
  @ApiProperty({
    description: 'Token de autenticação',
  })
  @IsJWT({ message: 'Token inválido' })
  token: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;
}

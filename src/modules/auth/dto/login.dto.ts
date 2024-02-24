import { IsEmail, IsNumberString, MaxLength, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  email: string;

  @IsNumberString()
  @MinLength(11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  @MaxLength(11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  cpf: string;
}

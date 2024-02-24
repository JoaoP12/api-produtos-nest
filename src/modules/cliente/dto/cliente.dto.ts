import { IsEmail, IsNumberString, IsString, MaxLength, MinLength } from 'class-validator';

export class ClienteDTO {
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsEmail()
  @MaxLength(100, { message: 'O email deve ter no máximo 100 caracteres' })
  email: string;

  @MinLength(11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  @MaxLength(11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  @IsNumberString({ no_symbols: true }, { message: 'O CPF deve conter apenas números' })
  cpf: string;
}

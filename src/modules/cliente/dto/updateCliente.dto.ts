import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateEmailClienteDTO {
  @IsEmail()
  @MaxLength(100, { message: 'O email deve ter no máximo 100 caracteres' })
  email: string;
}

export class UpdateNomeClienteDTO {
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string;
}

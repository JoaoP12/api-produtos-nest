import { IsJWT } from 'class-validator';

export class LoginValidationDTO {
  @IsJWT({ message: 'Token inválido' })
  token: string;
}

import { IsJWT } from 'class-validator';

export class JwtValidationDTO {
  @IsJWT({ message: 'Token inválido' })
  token: string;
}

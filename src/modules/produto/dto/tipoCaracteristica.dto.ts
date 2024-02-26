import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class TipoCaracteristicaDTO {
  @ApiProperty({
    description: 'Nome do tipo de característica',
    examples: ['Tamanho', 'Cor'],
  })
  @IsString()
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  nome: string;
}

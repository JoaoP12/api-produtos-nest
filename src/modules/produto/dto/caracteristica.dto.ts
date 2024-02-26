import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';

export class CaracteristicaDTO {
  @ApiProperty({
    description: 'Id do tipo de característica',
    type: 'number',
  })
  @IsNumber({}, { message: 'O idTipoCaracteristica deve ser um número' })
  @IsInt({ message: 'O idTipoCaracteristica deve ser um número inteiro' })
  @IsPositive({ message: 'O idTipoCaracteristica deve ser um número positivo' })
  idTipoCaracteristica: number;

  @ApiProperty({
    description: 'Nome da característica',
    examples: ['P', 'M', 'G', 'Azul', 'Vermelho'],
  })
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  nome: string;
}

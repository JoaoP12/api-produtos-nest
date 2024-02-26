import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { CaracteristicaDTO } from './caracteristica.dto';

export class AtualizarCaracteristicaDTO extends CaracteristicaDTO {
  @ApiProperty({
    description: 'Id da característica',
    type: 'number',
  })
  @IsNumber({}, { message: 'O idCaracteristica deve ser um número' })
  @IsInt({ message: 'O idCaracteristica deve ser um número inteiro' })
  @IsPositive({ message: 'O idCaracteristica deve ser um número positivo' })
  idCaracteristica: number;
}

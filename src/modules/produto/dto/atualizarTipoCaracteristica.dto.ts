import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { TipoCaracteristicaDTO } from './tipoCaracteristica.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AtualizarTipoCaracteristicaDTO extends TipoCaracteristicaDTO {
  @ApiProperty({
    description: 'Id do tipo de característica',
    type: 'number',
  })
  @IsNumber({}, { message: 'O idTipoCaracteristica deve ser um número' })
  @IsInt({ message: 'O idTipoCaracteristica deve ser um número inteiro' })
  @IsPositive({ message: 'O idTipoCaracteristica deve ser um número positivo' })
  idTipoCaracteristica: number;
}

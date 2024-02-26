import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ConsultarCaracteristicasDTO {
  @IsPositive({ message: 'O id do tipo da caracteristica deve ser um número positivo' })
  @IsInt({ message: 'O id do tipo da caracteristica deve ser um número inteiro' })
  @Transform(({ value }) => parseInt(value, 10))
  idTipoCaracteristica: number;
}

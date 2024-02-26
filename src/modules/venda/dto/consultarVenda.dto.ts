import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ConsultarVendaDTO {
  @IsPositive({ message: 'O id da venda deve ser um número positivo' })
  @IsInt({ message: 'O id da venda deve ser um número inteiro' })
  @Transform(({ value }) => parseInt(value, 10))
  idVenda: number;
}

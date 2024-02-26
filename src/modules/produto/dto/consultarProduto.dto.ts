import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class ConsultarProdutoDTO {
  @ApiProperty({
    description: 'Id do produto',
  })
  @IsPositive({ message: 'O id do produto deve ser um número positivo' })
  @IsInt({ message: 'O id do produto deve ser um número inteiro' })
  @Transform(({ value }) => parseInt(value, 10))
  idProduto: number;
}

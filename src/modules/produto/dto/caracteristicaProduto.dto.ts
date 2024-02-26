import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CaracteristicaProdutoDTO {
  @ApiProperty({
    description: 'Id do produto',
    type: 'number',
  })
  @IsNumber({}, { message: 'O idProduto deve ser um número' })
  @IsInt({ message: 'O idProduto deve ser um número inteiro' })
  @IsPositive({ message: 'O idProduto deve ser um número positivo' })
  idProduto: number;

  @ApiProperty({
    description: 'Id da característica do produto',
    type: 'number',
  })
  @IsNumber({}, { message: 'O idCaracteristica deve ser um número' })
  @IsInt({ message: 'O idCaracteristica deve ser um número inteiro' })
  @IsPositive({ message: 'O idCaracteristica deve ser um número positivo' })
  idCaracteristica: number;
}

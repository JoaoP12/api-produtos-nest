import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class ProdutoAssociadoDTO {
  @ApiProperty({
    description: 'Id do produto agregado',
    type: 'number',
  })
  @IsNumber({}, { message: 'O idProduto deve ser um número' })
  @IsInt({ message: 'O idProduto deve ser um número inteiro' })
  @IsPositive({ message: 'O idProduto deve ser um número positivo' })
  idProduto: number;

  @ApiProperty({
    description: 'Id do produto associado',
    type: 'number',
  })
  @IsNumber({}, { message: 'O idAssociado deve ser um número' })
  @IsInt({ message: 'O idAssociado deve ser um número inteiro' })
  @IsPositive({ message: 'O idAssociado deve ser um número positivo' })
  idAssociado: number;
}

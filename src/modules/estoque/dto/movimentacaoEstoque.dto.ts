import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { TipoMovimentacaoEstoque } from '../enum/tipoMovimentacaoEstoque.enum';
import { ApiProperty } from '@nestjs/swagger';

export class MovimentacaoEstoqueDTO {
  @ApiProperty({
    description: 'Id do produto',
  })
  @IsNumber({}, { message: 'O idProduto deve ser um número' })
  @IsInt({ message: 'O idProduto deve ser um número inteiro' })
  @IsPositive({ message: 'O idProduto deve ser um número positivo' })
  idProduto: number;

  @ApiProperty({
    description: 'Id da característica do produto',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O idCaracteristica deve ser um número' })
  @IsInt({ message: 'O idCaracteristica deve ser um número inteiro' })
  @IsPositive({ message: 'O idCaracteristica deve ser um número positivo' })
  idCaracteristica?: number;

  @ApiProperty({
    description: 'Tipo de movimentação de estoque',
    enum: TipoMovimentacaoEstoque,
  })
  @IsEnum(TipoMovimentacaoEstoque, { message: 'O tipo de movimentação de estoque deve ser ENTRADA, SAIDA ou AJUSTE' })
  tipoMovimentacaoEstoque: TipoMovimentacaoEstoque;

  @ApiProperty({
    description: 'Quantidade de produtos movimentados',
  })
  @IsNumber()
  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  quantidade: number;
}

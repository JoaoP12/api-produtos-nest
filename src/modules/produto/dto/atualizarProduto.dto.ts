import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class AtualizarProdutoDTO {
  @ApiProperty({
    description: 'Id do produto',
    type: 'number',
  })
  @IsNumber({}, { message: 'O idProduto deve ser um número' })
  @IsInt({ message: 'O idProduto deve ser um número inteiro' })
  @IsPositive({ message: 'O idProduto deve ser um número positivo' })
  idProduto: number;

  @ApiProperty({
    description: 'Nome do produto',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'O nome do produto deve ter no máximo 50 caracteres' })
  @MinLength(3, { message: 'O nome do produto deve ter no mínimo 3 caracteres' })
  nome?: string;

  @ApiProperty({
    description: 'URL de download do produto',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'A URL de download do produto deve ser uma URL válida' })
  @MaxLength(255, { message: 'A URL de download do produto deve ter no máximo 255 caracteres' })
  urlDownload?: string;

  @ApiProperty({
    description: 'Valor unitário do produto em centavos',
    type: 'number',
    required: false,
  })
  @IsOptional()
  @IsPositive({ message: 'O valor unitário do produto deve ser um número positivo' })
  @IsInt({ message: 'O valor unitário do produto deve ser um número inteiro indicando o valor em centavos' })
  valorUnitario?: number;

  @ApiProperty({
    description: 'Descrição do produto',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'A descrição do produto deve ter no mínimo 5 caracteres' })
  descricao?: string;
}

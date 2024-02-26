import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { TipoProduto } from '../enum/tipoProduto.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ProdutoDTO {
  @ApiProperty({
    description: 'Tipo do produto',
    enum: TipoProduto,
  })
  @IsEnum(TipoProduto, { message: 'O tipo do produto deve ser SIMPLES, CONFIGURAVEL, DIGITAL ou AGRUPADO' })
  tipoProduto: TipoProduto;

  @ApiProperty({
    description: 'Nome do produto',
    examples: ['Camiseta', 'Chave', 'Alicate'],
  })
  @IsString()
  @MaxLength(50, { message: 'O nome do produto deve ter no máximo 50 caracteres' })
  @MinLength(3, { message: 'O nome do produto deve ter no mínimo 3 caracteres' })
  nome: string;

  @ApiProperty({
    description: 'URL de download do produto',
    required: false,
  })
  @ValidateIf((o) => o.tipoProduto === TipoProduto.DIGITAL)
  @IsUrl({}, { message: 'A URL de download do produto deve ser uma URL válida' })
  @MaxLength(255, { message: 'A URL de download do produto deve ter no máximo 255 caracteres' })
  urlDownload?: string;

  @ApiProperty({
    description: 'Valor unitário do produto em centavos',
    type: 'number',
  })
  @IsPositive({ message: 'O valor unitário do produto deve ser um número positivo' })
  @IsInt({ message: 'O valor unitário do produto deve ser um número inteiro indicando o valor em centavos' })
  valorUnitario: number;

  @ApiProperty({
    description: 'Descrição do produto',
    examples: ['Camiseta de algodão', 'Chave de fenda', 'Alicate de corte'],
  })
  @IsString()
  @MinLength(5, { message: 'A descrição do produto deve ter no mínimo 5 caracteres' })
  descricao: string;

  @ApiProperty({
    description: 'Ids das características do produto',
    required: false,
    type: [Number],
  })
  @ValidateIf((o) => o.tipoProduto === TipoProduto.CONFIGURAVEL)
  @ArrayMinSize(2, { message: 'O produto deve ter no mínimo duas características' })
  @IsArray()
  @IsInt({ each: true, message: 'O campo "caracteristicas" deve ser uma lista de ids de caracteristicas' })
  @IsPositive({
    each: true,
    message: 'O campo "caracteristicas" deve ser uma lista de ids de caracteristicas positivos',
  })
  caracteristicas?: number[]; // array de ids das características

  @ApiProperty({
    description: 'Ids dos produtos simples associados',
    required: false,
    type: [Number],
  })
  @ValidateIf((o) => o.tipoProduto === TipoProduto.AGRUPADO)
  @ArrayMinSize(2, { message: 'O produto deve ter no mínimo dois produtos associados' })
  @IsArray()
  @IsInt({ each: true, message: 'O campo "produtosAssociados" deve ser uma lista de ids de produtos simples' })
  @IsPositive({
    each: true,
    message: 'O campo "produtosAssociados" deve ser uma lista de ids de produtos simples positivos',
  })
  produtosAssociados?: number[];
}

import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class ItemDTO {
  @ApiProperty({
    description: 'Id do produto',
    type: 'number',
  })
  @IsPositive({ message: 'O id do produto deve ser um número positivo' })
  @IsInt({ message: 'O id do produto deve ser um número inteiro' })
  @Transform(({ value }) => parseInt(value, 10))
  idProduto: number;

  @ApiProperty({
    description: 'Id da característica do produto',
    type: 'number',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O idCaracteristica deve ser um número' })
  @IsInt({ message: 'O idCaracteristica deve ser um número inteiro' })
  @IsPositive({ message: 'O idCaracteristica deve ser um número positivo' })
  idCaracteristica?: number;

  @ApiProperty({
    description: 'Quantidade do produto',
    type: 'number',
  })
  @IsNumber()
  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @IsPositive({ message: 'A quantidade deve ser um número positivo' })
  @Transform(({ value }) => parseInt(value, 10))
  quantidade: number;
}

export class ClienteDTO {
  @ApiProperty({
    description: 'CPF do cliente',
    example: '12345678901',
  })
  @MinLength(11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  @MaxLength(11, { message: 'O CPF deve ter exatamente 11 caracteres' })
  @IsNumberString({ no_symbols: true }, { message: 'O CPF deve conter apenas números' })
  cpf: string;

  @ApiProperty({
    description: 'Email do cliente',
  })
  @IsEmail()
  @MaxLength(100, { message: 'O email deve ter no máximo 100 caracteres' })
  @MinLength(5, { message: 'O email deve ter no mínimo 5 caracteres' })
  email: string;

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João da Silva',
  })
  @IsString()
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  nome: string;
}

export class VendaDTO {
  @ApiProperty({
    description: 'Descrição da venda',
    examples: ['Venda de camisetas', 'Venda de chaves', 'Venda de alicates'],
  })
  @IsString()
  @MinLength(5, { message: 'A descrição da venda deve ter no mínimo 5 caracteres' })
  descricao: string;

  @ApiProperty({
    description: 'Cliente da venda',
    type: ClienteDTO,
  })
  @ValidateNested()
  @IsObject()
  @Type(() => ClienteDTO)
  cliente: ClienteDTO;

  @ApiProperty({
    description: 'Itens da venda',
    type: [ItemDTO],
  })
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'A venda deve ter no mínimo um item' })
  @Type(() => ItemDTO)
  itens: ItemDTO[];
}

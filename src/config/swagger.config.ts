import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API de Produtos')
  .setDescription('API para cadastro de vendas, produtos e movimentações de estoque')
  .setVersion('1.0')
  .addTag('Produto')
  .addTag('Estoque')
  .addTag('Venda')
  .addTag('User')
  .addTag('Auth')
  .build();

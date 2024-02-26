import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venda } from '../../entities/venda.entity';
import { VendaProduto } from '../../entities/venda_produto.entity';
import { AuthGuard } from '../../guards/auth.guard';
import { EstoqueModule } from '../estoque/estoque.module';
import { ProdutoModule } from '../produto/produto.module';
import { VendaController } from './venda.controller';
import { VendaService } from './venda.service';

@Module({
  imports: [TypeOrmModule.forFeature([Venda, VendaProduto]), JwtModule.register({}), ProdutoModule, EstoqueModule],
  controllers: [VendaController],
  providers: [
    VendaService,
    {
      provide: APP_GUARD,
      useValue: AuthGuard,
    },
  ],
  exports: [VendaService],
})
export class VendaModule {}

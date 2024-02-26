import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimentacaoEstoque } from '../../entities/movimentacao_estoque.entity';
import { ProdutoModule } from '../produto/produto.module';
import { EstoqueController } from './estoque.controller';
import { EstoqueService } from './estoque.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([MovimentacaoEstoque]), ProdutoModule, JwtModule.register({})],
  controllers: [EstoqueController],
  providers: [
    EstoqueService,
    {
      provide: APP_GUARD,
      useValue: AuthGuard,
    },
  ],
  exports: [EstoqueService],
})
export class EstoqueModule {}

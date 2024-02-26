import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caracteristica } from '../../entities/caracteristica.entity';
import { CaracteristicaProduto } from '../../entities/caracteristica_produto.entity';
import { Produto } from '../../entities/produto.entity';
import { TipoCaracteristica } from '../../entities/tipo_caracteristica.entity';
import { CaracteristicaController } from './caracteristica.controller';
import { CaracteristicaService } from './caracteristica.service';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { ProdutoAssociado } from '../../entities/produto_associado.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../guards/auth.guard';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forFeature([Produto, TipoCaracteristica, Caracteristica, CaracteristicaProduto, ProdutoAssociado]),
    JwtModule.register({}),
  ],
  controllers: [ProdutoController, CaracteristicaController],
  providers: [
    ProdutoService,
    CaracteristicaService,
    {
      provide: APP_GUARD,
      useValue: AuthGuard,
    },
  ],
  exports: [ProdutoService, CaracteristicaService],
})
export class ProdutoModule {}

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuthGuard } from './guards/auth.guard';
import { AuthModule } from './modules/auth/auth.module';
import { EstoqueModule } from './modules/estoque/estoque.module';
import { ProdutoModule } from './modules/produto/produto.module';
import { UserModule } from './modules/user/user.module';
import { VendaModule } from './modules/venda/venda.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    JwtModule.register({}),
    UserModule,
    AuthModule,
    ProdutoModule,
    EstoqueModule,
    VendaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useValue: AuthGuard,
    },
  ],
})
export class AppModule {}

/**
 * Copyright (c) 2025 Gabriele Barberio
 * All rights reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entity/product.entity';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepositoryModule } from 'src/user-repository/user-repository.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    AuthModule,
    UserRepositoryModule,
  ],
  controllers: [StockController],
  providers: [StockService],  // Rimosso AuthModule da qui
  exports: [StockService],
})
export class StockModule {}

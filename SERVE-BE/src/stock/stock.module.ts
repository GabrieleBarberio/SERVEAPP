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
import { StockLog } from './entities/logs/stock-log.entity';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, StockLog]), UserModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}

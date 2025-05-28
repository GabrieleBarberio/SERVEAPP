/**
 * Copyright (c) 2025 Gabriele Barberio
 * All rights reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { Controller, Post, Get, Body } from '@nestjs/common';
import { StockService } from './stock.service';
import {
  CreateProductDto,
  UpdateProductQuantityDto,
} from './entity/dtos/stock.dto';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}
  @Post('create')
  createProduct(@Body() dto: CreateProductDto) {
    return this.stockService.createProduct(dto);
  }
  @Get('products')
  getAll() {
    return this.stockService.getAllProducts();
  }
  @Post('update-quantity')
  updateQuantity(@Body() dto: UpdateProductQuantityDto) {
    return this.stockService.updateProductQuantity(dto);
  }
}

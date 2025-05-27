/**
 * Copyright (c) 2025 Gabriele Barberio
 * All rights reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entity/product.entity';
import {
  CreateProductDto,
  UpdateProductQuantityDto,
} from './entity/dtos/stock.dto';
import { UserRepositoryService } from 'src/user-repository/user-repository.service';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private userRepo: UserRepositoryService,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return await this.productRepo.save(product);
  }

  async getAllProducts() {
    return await this.productRepo.find();
  }

  async updateProductQuantity(dto: UpdateProductQuantityDto) {
    const product = await this.productRepo.findOneBy({ id: dto.productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const delta = dto.movementType === 'IN' ? dto.quantity : -dto.quantity;
    product.quantity += delta;

    await this.productRepo.save(product);

    const user = await this.userRepo.getById(dto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return product;
  }

  async registerStockEntry(productId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }
}

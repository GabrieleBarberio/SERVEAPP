/**
 * Copyright (c) 2025 Gabriele Barberio
 * All rights reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { StockLog, StockMovementType } from './entities/logs/stock-log.entity';
import { Product } from 'src/products/entity/product.entity';
import {
  CreateProductDto,
  UpdateProductQuantityDto,
} from './entities/dtos/stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(StockLog)
    private logRepo: Repository<StockLog>,

    @InjectRepository(User) // Injecting the User repository
    private userRepo: Repository<User>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const product = this.productRepo.create(dto);
    return await this.productRepo.save(product);
  }

  async getAllProducts() {
    return await this.productRepo.find();
  }

  async updateProductQuantity(dto: UpdateProductQuantityDto) {
    // Trova il prodotto
    const product = await this.productRepo.findOneBy({ id: dto.productId });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Calcola la quantità da aggiornare
    const delta = dto.movementType === 'IN' ? dto.quantity : -dto.quantity;
    product.quantity += delta;

    // Salva il prodotto aggiornato
    await this.productRepo.save(product);

    // Trova l'utente solo una volta
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Crea il log
    const log = this.logRepo.create({
      product,
      quantity: dto.quantity,
      movementType: dto.movementType as StockMovementType,
      user,
      note: dto.note,
    });

    // Salva il log
    await this.logRepo.save(log);

    // Ritorna il prodotto aggiornato
    return product;
  }

  async registerStockEntry(
    productId: number,
    quantity: number,
    userId: number,
  ) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const log = this.logRepo.create({
      product,
      quantity,
      movementType: StockMovementType.IN, // or StockMovementType.OUT for exit
      user,
    });

    await this.logRepo.save(log);

    // Update stock quantity
    product.quantity += quantity; // or -= for exit
    await this.productRepo.save(product);

    return log;
  }
}

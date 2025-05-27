/**
 * Copyright (c) 2025 Gabriele Barberio
 * All rights reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockService } from '../stock/stock.service';
import { Product } from '../products/entity/product.entity';
import { UpdateProductQuantityDto } from '../stock/entity/dtos/stock.dto';
import { User } from 'src/user-repository/entity/user.entity';
import { NotFoundException } from '@nestjs/common';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('StockService', () => {
  let service: StockService;
  let productRepo: MockType<Repository<Product>>;
  let userRepo: MockType<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<StockService>(StockService);
    productRepo = module.get(getRepositoryToken(Product));
    userRepo = module.get(getRepositoryToken(User));
  });

  describe('updateProductQuantity', () => {
    it('should throw if user not found', async () => {
      const product = { id: 1, quantity: 10 } as Product;
      const dto: UpdateProductQuantityDto = {
        productId: 1,
        quantity: 5,
        movementType: 'IN',
        note: 'test',
        userId: 2,
      };

      (productRepo.findOneBy as jest.Mock).mockResolvedValue(product);
      (userRepo.findOneBy as jest.Mock).mockResolvedValue(undefined);

      await expect(service.updateProductQuantity(dto)).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });

    it('should update quantity and create a log (IN)', async () => {
      const product = { id: 1, quantity: 10 } as Product;
      const updated = { ...product, quantity: 15 } as Product;
      const user = { id: 2 } as User;

      const dto: UpdateProductQuantityDto = {
        productId: 1,
        quantity: 5,
        movementType: 'IN',
        note: 'riassortimento',
        userId: 2,
      };

      (productRepo.findOneBy as jest.Mock).mockResolvedValue(product);
      (productRepo.save as jest.Mock).mockResolvedValue(updated);

      (userRepo.findOne as jest.Mock).mockResolvedValue(user);

      const result = await service.updateProductQuantity(dto);

      expect(productRepo.findOneBy).toHaveBeenCalledWith({ id: dto.productId });
      expect(productRepo.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });

    it('should update quantity and create a log (OUT)', async () => {
      const product = { id: 1, quantity: 10 } as Product;
      const updated = { ...product, quantity: 7 } as Product;
      const dto: UpdateProductQuantityDto = {
        productId: 1,
        quantity: 3,
        movementType: 'OUT',
        note: 'venduto',
        userId: 3,
      };
      const user = new User();
      user.id = 3;
      user.email = 'giovanni.rossi@example.com';
      user.password = 'hashedpassword';

      (productRepo.findOneBy as jest.Mock).mockResolvedValue(product);
      (userRepo.findOne as jest.Mock).mockResolvedValue(user);
      (productRepo.save as jest.Mock).mockResolvedValue(updated);

      const result = await service.updateProductQuantity(dto);
      expect(productRepo.save).toHaveBeenCalledWith(updated);
      expect(result).toEqual(updated);
    });
  });
});

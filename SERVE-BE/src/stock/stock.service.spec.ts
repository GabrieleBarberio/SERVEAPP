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
import { StockLog } from '../stock/entities/logs/stock-log.entity';
import { UpdateProductQuantityDto } from '../stock/entities/dtos/stock.dto';
import { User } from '../users/entity/user.entity';
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
  let logRepo: MockType<Repository<StockLog>>;
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
          provide: getRepositoryToken(StockLog),
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
    logRepo = module.get(getRepositoryToken(StockLog));
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

      (logRepo.create as jest.Mock).mockReturnValue({} as StockLog);
      (logRepo.save as jest.Mock).mockResolvedValue({} as StockLog);

      const result = await service.updateProductQuantity(dto);

      expect(productRepo.findOneBy).toHaveBeenCalledWith({ id: dto.productId });
      expect(productRepo.save).toHaveBeenCalledWith(updated);
      expect(logRepo.create).toHaveBeenCalledWith({
        product,
        quantity: dto.quantity,
        movementType: dto.movementType,
        user: user,
        note: dto.note,
      });
      expect(logRepo.save).toHaveBeenCalled();
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
      user.fullName = 'Giovanni Rossi';
      user.email = 'giovanni.rossi@example.com';
      user.password = 'hashedpassword';
      user.role = 'OPERATOR';
      user.logs = [];
      user.createdAt = new Date('2023-01-01T12:00:00');
      user.updatedAt = new Date('2023-01-01T12:00:00');

      (productRepo.findOneBy as jest.Mock).mockResolvedValue(product);
      (userRepo.findOne as jest.Mock).mockResolvedValue(user);
      (productRepo.save as jest.Mock).mockResolvedValue(updated);
      (logRepo.create as jest.Mock).mockReturnValue({} as StockLog);
      (logRepo.save as jest.Mock).mockResolvedValue({} as StockLog);

      const result = await service.updateProductQuantity(dto);
      expect(productRepo.save).toHaveBeenCalledWith(updated);
      expect(logRepo.create).toHaveBeenCalledWith({
        product,
        quantity: dto.quantity,
        movementType: dto.movementType,
        user,
        note: dto.note,
      });
      expect(result).toEqual(updated);
    });
  });
});

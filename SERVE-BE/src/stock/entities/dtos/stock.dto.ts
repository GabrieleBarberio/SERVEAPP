/**
 * Copyright (c) 2025 Gabriele Barberio
 * All rights reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { IsInt, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  name: string;
  unit: string;
  nutritionalInfo?: string;
}
//per ora li tengo soppressi poi fixo

export class UpdateProductQuantityDto {
  @IsInt({ message: 'productId deve essere un numero intero' })
  productId: number;

  @IsInt({ message: 'quantity deve essere un numero intero' })
  quantity: number;

  @IsEnum(['IN', 'OUT'])
  movementType: 'IN' | 'OUT';

  @IsOptional({ always: true })
  @IsString()
  note?: string;

  @IsInt({ message: 'userID deve essere un numero intero' })
  userId: number;
}

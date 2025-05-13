/**
 * Copyright (c) 2025 Gabriele Barberio
 * All rights reserved.
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockLog } from '../../stock/entities/logs/stock-log.entity';

export type UserRole = 'ADMIN' | 'MANAGER' | 'OPERATOR';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // da cifrare con bcrypt

  @Column({
    type: 'enum',
    enum: ['ADMIN', 'MANAGER', 'OPERATOR'],
    default: 'OPERATOR',
  })
  role: UserRole;

  @OneToMany(() => StockLog, (log) => log.user)
  logs: StockLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

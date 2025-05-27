import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../user-repository/entity/user.entity';
import { UserMapper } from '../auth/mapper/UserMapper';
import { UserRepositoryModule } from 'src/user-repository/user-repository.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserRepositoryModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UserMapper],
  exports: [AuthService],
})
export class AuthModule {}

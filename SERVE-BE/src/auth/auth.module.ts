import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User } from '../user-repository/entity/user.entity';
import { UserMapper } from '../auth/mapper/UserMapper';
import { UserRepositoryModule } from 'src/user-repository/user-repository.module';
import { AuthController } from 'src/auth/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([User]),
    UserRepositoryModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, UserMapper],
  exports: [AuthService],
})
export class AuthModule {}

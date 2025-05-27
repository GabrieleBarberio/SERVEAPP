import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserMapper } from 'src/auth/mapper/UserMapper';
import { UserRepositoryModule } from 'src/user-repository/user-repository.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret_da_aggiornare_per_ora',
      signOptions: { expiresIn: '1d' },
    }),
    UserRepositoryModule,
  ],
  providers: [AuthService, UserMapper, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

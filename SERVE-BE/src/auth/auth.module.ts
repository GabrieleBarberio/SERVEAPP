import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserMapper } from 'src/auth/mapper/UserMapper';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret_da_aggiornare_per_ora',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, UserMapper, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
//TODO una user repository (modulo) injectable da fare inject in auth e da usare per auth service

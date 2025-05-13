import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'; // Modifica con il tuo model User
import { JwtPayload } from './jwt-payload.interface'; // Definisci questa interfaccia

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user = await this.userRepository.findOne({ where: { username } });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (user && user.password === pass) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload: JwtPayload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

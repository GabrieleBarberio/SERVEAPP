import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { TokenUtils } from './utils/token-utils';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {
  private tokenUtils: TokenUtils;

  constructor(private readonly jwtService: JwtService) {
    const cfg = jwtService['options'] as JwtModuleOptions;
    this.tokenUtils = new TokenUtils(cfg.secret as string, cfg.signOptions);
  }

  login(user: {
    userId: string;
    username: string;
    roles: string[];
    permissions?: string[];
  }) {
    const payload = {
      sub: user.userId,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions || [],
    };
    return { access_token: this.tokenUtils.signToken(payload) };
  }

  validateToken(authHeader?: string) {
    const token = TokenUtils.extractToken(authHeader);
    if (!token) throw new UnauthorizedException('Token mancante');
    try {
      return this.tokenUtils.verifyToken(token);
    } catch {
      throw new UnauthorizedException('Token non valido');
    }
  }
  generateJwt(user: User): { access_token: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

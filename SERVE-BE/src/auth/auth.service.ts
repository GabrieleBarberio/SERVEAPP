import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenUtils } from './utils/token-utils';

@Injectable()
export class AuthService {
  private tokenUtils: TokenUtils;

  constructor(private readonly jwtService: JwtService) {
    // Use same config from JwtModule
    const cfg = jwtService['options'];
    this.tokenUtils = new TokenUtils(cfg.secret as string, cfg.signOptions);
  }

  async login(user: { userId: string; username: string; roles: string[]; permissions?: string[] }) {
    const payload = { sub: user.userId, username: user.username, roles: user.roles, permissions: user.permissions || [] };
    return { access_token: this.tokenUtils.signToken(payload) };
  }

  async validateToken(authHeader?: string) {
    const token = TokenUtils.extractToken(authHeader);
    if (!token) throw new UnauthorizedException('Token mancante');
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.tokenUtils.verifyToken(token);
    } catch {
      throw new UnauthorizedException('Token non valido');
    }
  }
}

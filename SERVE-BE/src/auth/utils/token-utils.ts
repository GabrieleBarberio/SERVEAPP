import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { JwtPayload} from 'src/auth/models/JwtPayload';
/**
 * Utility class for handling JWT operations.
 */
export class TokenUtils {
  private jwtService: JwtService;

  constructor(secretOrKey: string, signOptions?: JwtSignOptions) {
    // Initialize JwtService with provided config
    this.jwtService = new JwtService({ secret: secretOrKey, signOptions });
  }
  signToken(payload: JwtPayload, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload.mail, options);
  }
  verifyToken(token: string, options?: JwtVerifyOptions): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token, options);
  }
  static extractToken(authHeader?: string): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
    return parts[1];
  }

  static hasRole(payload: JwtPayload, requiredRoles: string[]): boolean {
    if (!payload.roles) return false;
    return requiredRoles.some(r => payload.roles.includes(r));
  };

export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

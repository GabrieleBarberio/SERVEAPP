import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { TokenUtils } from './utils/token-utils';
import { User } from 'src/user-repository/entity/user.entity';
import { UserLoginDto } from 'src/auth/dtos/user.login.dto';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserRegisterDto } from 'src/auth/dtos/user.register.dto';
import { UserDto } from 'src/auth/dtos/user.dto';
import { RoleConstants } from 'src/roles/constants/RoleConstants';
import { UserMapper } from 'src/auth/mapper/UserMapper';

@Injectable()
export class AuthService {
  private tokenUtils: TokenUtils;

  constructor(
    private readonly jwtService: JwtService,
    private userRepository: Repository<User>,
    private userMapper: UserMapper,
  ) {
    const cfg = jwtService['options'] as JwtModuleOptions;
    this.tokenUtils = new TokenUtils(cfg.secret as string, cfg.signOptions);
  }

  async login(userLoginDto: UserLoginDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: userLoginDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Email o password non validi');
      }

      const passwordMatch = await bcrypt.compare(
        userLoginDto.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('login non validi');
      }

      return this.generateJwt(user);
    } catch (error) {
      console.error(error);
    }
  }

  async registerUser(userRegisterDto: UserRegisterDto): Promise<UserDto> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: userRegisterDto.email },
          { username: userRegisterDto.username },
        ],
      });

      if (existingUser) {
        throw new ConflictException(
          "Impossibile registrare l'utente: email o username già esistenti",
        );
      }

      const hashedPassword: string = await bcrypt.hash(
        userRegisterDto.password,
        10,
      );

      const userToSave: User = this.userMapper.mapToEntity(userRegisterDto);
      userToSave.password = hashedPassword;
      userToSave.role = RoleConstants.HIGH;

      const savedUser: User = await this.userRepository.save(userToSave);
      return this.userMapper.mapToDto(savedUser);
    } catch (error) {
      console.error(error);
      throw error;
    }
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

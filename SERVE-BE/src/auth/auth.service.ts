import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { TokenUtils } from './utils/token-utils';
import { User } from 'src/user-repository/entity/user.entity';
import { UserLoginDto } from 'src/auth/dtos/user.login.dto';
import * as bcrypt from 'bcrypt';
import { UserRegisterDto } from 'src/auth/dtos/user.register.dto';
import { UserDto } from 'src/auth/dtos/user.dto';
import { RoleConstants } from 'src/roles/constants/RoleConstants';
import { UserMapper } from 'src/auth/mapper/UserMapper';
import { ServeException } from 'src/common/exception/serve-exception';
import { CustomExceptionEnum } from 'src/common/enums/custom-exception';
import { UserRepositoryService } from 'src/user-repository/user-repository.service';
import { propagateException } from 'src/common/exception/exception-utils';
import { UserAuthDto } from './dtos/user.auth.dto';

@Injectable()
export class AuthService {
  private tokenUtils: TokenUtils;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepositoryService,
    private readonly userMapper: UserMapper,
  ) {
    const cfg = jwtService['options'] as JwtModuleOptions;
    this.tokenUtils = new TokenUtils(cfg.secret as string, cfg.signOptions);
  }

  async login(userLoginDto: UserLoginDto) {
    const res: UserAuthDto = new UserAuthDto();
    try {
      const user: User | null = await this.userRepository.getByEmail(
        userLoginDto.email,
      );

      if (!user) {
        throw new ServeException(CustomExceptionEnum.USER_NOT_FOUND);
      }

      const passwordMatch: boolean = await bcrypt.compare(
        userLoginDto.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new ServeException(CustomExceptionEnum.INVALID_CREDENTIALS);
      }
      res.setUser(this.userMapper.mapToDto(user));
      res.setServeToken(this.generateJwt(user).serveToken);

      return res;
    } catch (error) {
      propagateException(error);
    }
  }

  async registerUser(userRegisterDto: UserRegisterDto): Promise<UserDto> {
    try {
      const existingUser: User | null =
        await this.userRepository.getByUsernameEmail(
          userRegisterDto.username,
          userRegisterDto.email,
        );

      if (existingUser) {
        throw new ServeException(CustomExceptionEnum.USER_ALREADY_EXISTS);
      }

      const hashedPassword: string = await bcrypt.hash(
        userRegisterDto.password,
        10,
      );

      const userToSave: User = this.userMapper.mapToEntity(userRegisterDto);
      userToSave.password = hashedPassword;
      userToSave.role = RoleConstants.HIGH;

      const savedUser: User = await this.userRepository.create(userToSave);
      return this.userMapper.mapToDto(savedUser);
    } catch (error) {
      propagateException(error);
    }
  }

  validateToken(authHeader?: string) {
    const token = TokenUtils.extractToken(authHeader);
    if (!token) throw new ServeException(CustomExceptionEnum.TOKEN_MISSING);
    try {
      return this.tokenUtils.verifyToken(token);
    } catch {
      throw new ServeException(CustomExceptionEnum.INVALID_TOKEN);
    }
  }

  generateJwt(user: User): { serveToken: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      serveToken: this.jwtService.sign(payload),
    };
  }
}

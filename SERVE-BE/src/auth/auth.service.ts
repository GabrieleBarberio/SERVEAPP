import { Injectable } from '@nestjs/common';
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
import { CustomException } from 'src/common/exception/custom-exception';
import { CustomExceptionEnum } from 'src/common/enums/custom-exception';

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
      const user: User | null = await this.userRepository.findOne({
        where: { email: userLoginDto.email },
      });

      if (!user) {
        throw new CustomException(CustomExceptionEnum.USER_NOT_FOUND);
      }

      const passwordMatch: boolean = await bcrypt.compare(
        userLoginDto.password,
        user.password,
      );

      if (!passwordMatch) {
        throw new CustomException(CustomExceptionEnum.INVALID_CREDENTIALS);
      }

      return this.generateJwt(user);
    } catch (error) {
      console.error(error);
      throw new CustomException(CustomExceptionEnum.GENERIC_ERROR);
    }
  }

  async registerUser(userRegisterDto: UserRegisterDto): Promise<UserDto> {
    try {
      const existingUser: User | null = await this.userRepository.findOne({
        where: [
          { email: userRegisterDto.email },
          { username: userRegisterDto.username },
        ],
      });

      if (existingUser) {
        throw new CustomException(CustomExceptionEnum.USER_ALREADY_EXISTS);
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
      if (error instanceof CustomException) throw error;
      console.error(error);
      throw new CustomException(CustomExceptionEnum.GENERIC_ERROR, [error]);
    }
  }

  validateToken(authHeader?: string) {
    const token = TokenUtils.extractToken(authHeader);
    if (!token) throw new CustomException(CustomExceptionEnum.TOKEN_MISSING);
    try {
      return this.tokenUtils.verifyToken(token);
    } catch {
      throw new CustomException(CustomExceptionEnum.INVALID_TOKEN);
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

import { UserMapper } from 'src/users/mapper/UserMapper';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRegisterDto } from 'src/users/dtos/user.register.dto';
import { User } from 'src/users/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from 'src/users/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { RoleConstants } from 'src/roles/constants/RoleConstants';
import { UserLoginDto } from 'src/users/dtos/user.login.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
    private readonly authService: AuthService,
  ) {}

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

      return this.authService.generateJwt(user);
    } catch (error) {
      console.error(error);
    }
  }
}

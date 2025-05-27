import { Injectable } from '@nestjs/common';
import { User } from 'src/user-repository/entity/user.entity';
import { UserDto } from 'src/auth/dtos/user.dto';
import { UserRegisterDto } from 'src/auth/dtos/user.register.dto';

@Injectable()
export class UserMapper {
  mapToDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
  mapToEntity(userRegisterDto: UserRegisterDto): User {
    const user = new User();
    user.email = userRegisterDto.email;
    user.username = userRegisterDto.username;
    user.password = userRegisterDto.password;
    user.role = userRegisterDto.role;

    return user;
  }
  mapToDtos(users: User[]): UserDto[] {
    return users.map((user) => this.mapToDto(user));
  }
}

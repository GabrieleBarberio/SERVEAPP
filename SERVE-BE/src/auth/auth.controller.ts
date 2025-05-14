import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterDto } from 'src/users/dtos/user.register.dto';
import { UserService } from 'src/users/user.service';
import { UserDto } from 'src/users/dtos/user.dto';
import { UserLoginDto } from 'src/users/dtos/user.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerBase(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<UserDto> {
    return this.userService.registerUser(userRegisterDto);
  }
  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.userService.login(userLoginDto);
  }
}

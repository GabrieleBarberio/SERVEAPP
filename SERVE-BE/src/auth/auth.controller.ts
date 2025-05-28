import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { UserLoginDto } from 'src/auth/dtos/user.login.dto';
import { AuthService } from 'src/auth/auth.service';
import { ServeExceptionFilter } from '../common/exception/serve-exception-filter';
import { UserRegisterDto } from 'src/auth/dtos/user.register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseFilters(ServeExceptionFilter)
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('register')
  @UseFilters(ServeExceptionFilter)
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.registerUser(userRegisterDto);
  }
}

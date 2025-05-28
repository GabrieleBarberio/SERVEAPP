import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserLoginDto } from 'src/auth/dtos/user.login.dto';
import { AuthService } from 'src/auth/auth.service';
import { ServeExceptionFilter } from '../common/exception/serve-exception-filter';
import { UserRegisterDto } from 'src/auth/dtos/user.register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login utente' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 201, description: 'Login effettuato con successo.' })
  @ApiResponse({ status: 401, description: 'Credenziali non valide.' })
  @UseFilters(ServeExceptionFilter)
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrazione utente' })
  @ApiBody({ type: UserRegisterDto })
  @ApiResponse({ status: 201, description: 'Utente registrato con successo.' })
  @ApiResponse({ status: 400, description: 'Dati non validi.' })
  @UseFilters(ServeExceptionFilter)
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.registerUser(userRegisterDto);
  }
}

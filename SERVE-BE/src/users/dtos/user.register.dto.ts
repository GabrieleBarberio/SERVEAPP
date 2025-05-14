import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { RoleConstants } from 'src/roles/constants/RoleConstants';

export class UserRegisterDto {
  @IsString()
  @MinLength(4)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(RoleConstants)
  role: RoleConstants;
}

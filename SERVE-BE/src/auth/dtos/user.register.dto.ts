import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { RoleConstants } from 'src/roles/constants/RoleConstants';
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto {
  @ApiProperty({ example: 'john_doe', minLength: 4 })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({ example: 'user@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'HIGH' })
  @IsEnum(RoleConstants)
  role: RoleConstants;
}

import { UserDto } from './user.dto';

export class UserAuthDto {
  user: UserDto;
  serveToken: string;

  setUser(user: UserDto): void {
    this.user = user;
  }
  setServeToken(token: string): void {
    this.serveToken = token;
  }
  getUser(): UserDto {
    return this.user;
  }
  getServeToken(): string {
    return this.serveToken;
  }
}

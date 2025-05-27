import { RoleConstants } from 'src/roles/constants/RoleConstants';

export class UserDto {
  id: number;
  email: string;
  username: string;
  role: RoleConstants;
}

import { Expose } from 'class-transformer';

export class RoleDto {
  @Expose()
  roleCode!: string;

  @Expose()
  name!: string;
}

import { Injectable } from '@nestjs/common';
import { RoleDto } from 'src/roles/dtos/role.dto';
import { Role } from 'src/roles/entity/role.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RoleMapper {
  mapToDto(entity: Role): RoleDto {
    const roleDto = plainToInstance(RoleDto, entity, {
      excludeExtraneousValues: true,
    });
    return roleDto;
  }
  mapToDtos(roles: Role[]): RoleDto[] {
    return roles.map((role: Role): Role => {
      return this.mapToDto(role);
    });
  }
}

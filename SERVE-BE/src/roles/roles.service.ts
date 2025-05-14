import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entity/role.entity';
import { Repository } from 'typeorm';
import { RoleMapper } from 'src/roles/mapper/roles.mapper';
import { RoleDto } from 'src/roles/dtos/role.dto';
import { RoleConstants } from 'src/roles/constants/RoleConstants';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private mapper: RoleMapper,
  ) {}

  async findaAll(): Promise<RoleDto[]> {
    let roles: Role[] = [];
    try {
      roles = await this.roleRepository.find();
    } catch (error) {
      console.error(error);
    }
    if (roles.length === 0) {
      throw new NotFoundException();
    }
    return this.mapper.mapToDtos(roles);
  }

  async findByName(name: RoleConstants): Promise<RoleDto> {
    let role: Role | null = null;
    try {
      role = await this.roleRepository.findOneBy({ name });
    } catch (error) {
      console.error('Errore durante la ricerca del ruolo:', error);
      throw new Error('Errore durante la ricerca del ruolo');
    }

    if (role === null) {
      throw new NotFoundException(`Ruolo con il nome ${name} non trovato`);
    }

    return this.mapper.mapToDto(role);
  }
}

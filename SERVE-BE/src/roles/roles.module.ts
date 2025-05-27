import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entity/role.entity';
import { RoleMapper } from 'src/roles/mapper/roles.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService, RoleMapper],
  exports: [RolesService],
})
export class RolesModule {}

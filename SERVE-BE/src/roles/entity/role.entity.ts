import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'registry_role', schema: 'serve_core' })
export class Role {
  @PrimaryColumn({ name: 'role_code', type: 'varchar', length: 4 })
  roleCode: string;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description?: string;
}

// 角色权限表
import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Role } from './role.entity';
import { Menu } from './menu.entity';
import { Action } from './action.entity';

@Entity({ name: 'role_permission', comment: '角色-菜单-动作授权关系表' })
export class RolePermission {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  role_id!: string;

  @PrimaryColumn({ type: 'varchar', length: 32 })
  menu_id!: string;

  @PrimaryColumn({ type: 'varchar', length: 32 })
  action_id!: string;

  @Column({ type: 'tinyint', default: 1 })
  allow!: number;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @ManyToOne(() => Menu, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu!: Menu;

  @ManyToOne(() => Action, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'action_id' })
  action!: Action;
}

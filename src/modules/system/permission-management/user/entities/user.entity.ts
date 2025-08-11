// 用户信息表
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '@/common/database/entities';
import { Dept } from '@/modules/system/org-structure/entities/dept.entity';
import { Position } from '@/modules/system/org-structure/entities/position.entity';
import { Role } from '@/modules/system/permission-management/entities/role.entity';

@Entity({ name: 'user' /* MySQL: 用户信息表 */ })
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '用户名（登录账号）',
  })
  username!: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '用户昵称',
  })
  nickname!: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '密码（加密存储）',
  })
  password!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '邮箱',
  })
  email!: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: '手机号',
  })
  phone!: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '头像URL',
  })
  avatar!: string | null;

  @ManyToOne(() => Dept, { onDelete: 'SET NULL' })
  @Index()
  dept!: Dept | null; // 所属部门

  @ManyToOne(() => Position, { onDelete: 'SET NULL' })
  @Index()
  position!: Position | null; // 所属岗位

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role', // 中间表名
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: Role[]; // 用户角色

  @Column({
    type: 'datetime',
    nullable: true,
    comment: '最后登录时间',
  })
  last_login_at!: Date | null;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: '最后登录IP',
  })
  last_login_ip!: string | null;
}

// 角色表
import { Entity } from 'typeorm';
import { NamedEntity } from '@/common/database/entities';

@Entity({ name: 'role', comment: '角色信息表' })
export class Role extends NamedEntity {}

// 动作表
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/database/entities';

@Entity({ name: 'action', comment: '权限动作表' })
export class Action extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 64, unique: true })
  code!: string;
}

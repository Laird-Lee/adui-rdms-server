// 岗位表
import { Entity, ManyToOne, Index } from 'typeorm';
import { NamedEntity } from '@/common/database/entities';
import { Dept } from './dept.entity';

@Entity({ name: 'position', comment: '部门岗位表' })
export class Position extends NamedEntity {
  @ManyToOne(() => Dept, { onDelete: 'RESTRICT' })
  @Index()
  dept!: Dept;
}

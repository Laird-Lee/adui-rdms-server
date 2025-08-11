// 部门表
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { TreeEntity } from '@/common/database/entities';

@Entity({ name: 'dept', comment: '部门组织表（树形）' })
export class Dept extends TreeEntity {
  @ManyToOne(() => Dept, (d) => d.children, { onDelete: 'SET NULL' })
  parent?: Dept | null;

  @OneToMany(() => Dept, (d) => d.parent)
  children?: Dept[];
}

// 菜单表
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { TreeEntity } from '@/common/database/entities';

@Entity({ name: 'menu', comment: '菜单资源表（树形）' })
export class Menu extends TreeEntity {
  @ManyToOne(() => Menu, (m) => m.children, { onDelete: 'SET NULL' })
  parent?: Menu | null;

  @OneToMany(() => Menu, (m) => m.parent)
  children?: Menu[];
}

import { Entity, OneToMany } from 'typeorm';
import { DictItem } from './dict-item.entity';
import { NamedEntity } from '@/common/database/entities';

@Entity({ name: 'sys_dict', comment: '数据字典' })
export class Dict extends NamedEntity {
  @OneToMany(() => DictItem, (item) => item.dict)
  items!: DictItem[];
}

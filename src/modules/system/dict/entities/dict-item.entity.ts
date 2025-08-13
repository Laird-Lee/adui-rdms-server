import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Dict } from './dict.entity';
import { BaseEntity, CommonStatus } from '@/common/database/entities';

@Entity({ name: 'sys_dict_item', comment: '数据字典子项' })
export class DictItem extends BaseEntity {
  @Index()
  @Column({
    type: 'varchar',
    name: 'dict_id',
    length: 32,
    comment: '所属字典ID',
  })
  dictId!: string;

  @ManyToOne(() => Dict, (dict) => dict.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dict_id', referencedColumnName: 'id' })
  dict!: Dict;

  @Column({ type: 'varchar', length: 100, comment: '显示文本' })
  label!: string;

  @Column({ type: 'varchar', length: 100, comment: '选项值' })
  value!: string;

  @Column({
    type: 'tinyint',
    default: CommonStatus.Enabled,
    comment: '状态：0-禁用，1-启用',
  })
  status!: CommonStatus;

  @Column({ type: 'int', default: 100, comment: '排序（数值越小越靠前）' })
  sort!: number;
}

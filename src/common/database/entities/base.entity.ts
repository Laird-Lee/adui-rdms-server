import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  Column,
  BaseEntity as TypeOrmBaseEntity,
  BeforeInsert,
} from 'typeorm';
import { customAlphabet } from 'nanoid';
import { Transform } from 'class-transformer';
import dayjs, { Dayjs } from 'dayjs';

export enum CommonStatus {
  Disabled = 0, // 禁用
  Enabled = 1, // 启用
}

const ALPHABET = '0123456789';
const nanoid11 = customAlphabet(ALPHABET, 11);
export function generateId(): string {
  return `14040${nanoid11()}`;
}

// 基础实体，包含主键与通用时间字段
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 32,
    comment: '主键ID（自定义生成）',
  })
  id!: string;

  @Column({ type: 'text', nullable: true, comment: '备注' })
  remark!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    comment: '创建时间',
  })
  @Transform(
    ({
      value,
    }: {
      value: string | number | Date | Dayjs | null | undefined;
    }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null),
    { toPlainOnly: true },
  )
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    comment: '更新时间',
  })
  @Transform(
    ({
      value,
    }: {
      value: string | number | Date | Dayjs | null | undefined;
    }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null),
    { toPlainOnly: true },
  )
  updatedAt!: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: '删除时间（软删除标记）',
  })
  @Transform(
    ({
      value,
    }: {
      value: string | number | Date | Dayjs | null | undefined;
    }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null),
    { toPlainOnly: true },
  )
  deletedAt!: Date | null;

  @BeforeInsert()
  protected ensureId() {
    if (!this.id) {
      this.id = generateId();
    }
  }
}

// 具名实体，包含通用的名称、编码、状态与排序字段
export abstract class NamedEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100, comment: '名称' })
  name!: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    unique: false,
    comment: '编码（可选）',
  })
  code!: string | null;

  @Column({
    type: 'tinyint',
    default: CommonStatus.Enabled,
    comment: '状态：0-禁用，1-启用',
  })
  status!: CommonStatus;

  @Column({ type: 'int', default: 100, comment: '排序（数值越小越靠前）' })
  sort!: number;
}

// 树形实体，包含父级、路径与层级等字段
export abstract class TreeEntity extends NamedEntity {
  @Column({
    type: 'varchar',
    name: 'parent_id',
    length: 32,
    nullable: true,
    comment: '父级ID（根节点为空）',
  })
  parentId!: string | null;

  @Column({
    type: 'varchar',
    length: 1024,
    comment: '节点路径（从根到当前的ID链）',
  })
  path!: string;
}

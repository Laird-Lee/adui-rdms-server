import {
  Column,
  type ColumnOptions,
  PrimaryColumn,
  type PrimaryColumnOptions,
} from 'typeorm';

// 主键列（字符串 ID，默认长度 32，可按需调整）
export function IdColumn(
  options: Omit<PrimaryColumnOptions, 'type' | 'length'> = {},
): PropertyDecorator {
  return PrimaryColumn({
    type: 'varchar',
    length: 32,
    ...options,
  });
}

// 外键/关联 ID 列（字符串 ID，默认长度 32）
export function FKColumn(
  options: Omit<ColumnOptions, 'type' | 'length'> = {},
): PropertyDecorator {
  return Column({
    type: 'varchar',
    length: 32,
    ...options,
  });
}

// 通用代码列（短字符串编码）
export function CodeColumn(
  options: Omit<ColumnOptions, 'type' | 'length'> = {},
): PropertyDecorator {
  return Column({
    type: 'varchar',
    length: 64,
    ...options,
  });
}

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

export enum CommonStatus {
  Disabled = 0,
  Enabled = 1,
}

const ALPHABET = '0123456789';
const nanoid16 = customAlphabet(ALPHABET, 16);
export function generateId(): string {
  return `14040${nanoid16()}`;
}

export abstract class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 32 })
  id!: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deleted_at!: Date | null;

  @BeforeInsert()
  protected ensureId() {
    if (!this.id) {
      this.id = generateId();
    }
  }
}

export abstract class NamedEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 64, nullable: true, unique: false })
  code!: string | null;

  @Column({ type: 'tinyint', default: CommonStatus.Enabled })
  status!: CommonStatus;

  @Column({ type: 'int', default: 100 })
  sort!: number;
}

export abstract class TreeEntity extends NamedEntity {
  @Column({ type: 'varchar', length: 32, nullable: true })
  parent_id!: string | null;

  @Column({ type: 'varchar', length: 1024 })
  path!: string;

  @Column({ type: 'int', default: 1 })
  level!: number;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PageQueryDto {
  @ApiProperty({ description: '页码（从 1 开始）', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  current: number = 1;

  @ApiProperty({ description: '每页数量', default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @ApiPropertyOptional({ description: '排序字段（可选）' })
  @IsOptional()
  orderBy?: string;

  @ApiPropertyOptional({ description: '排序方向：ASC|DESC（可选）' })
  @IsOptional()
  order?: 'ASC' | 'DESC';
}

export class PageMeta {
  @ApiProperty({ description: '当前页码' })
  current!: number;

  @ApiProperty({ description: '每页数量' })
  pageSize!: number;

  @ApiProperty({ description: '总条数' })
  total!: number;

  @ApiProperty({ description: '总页数' })
  pageCount!: number;
}

// 统一分页返回结构：{ list, meta }
export class PageResult<T> {
  @ApiProperty({ description: '列表数据', isArray: true })
  list!: T[];

  @ApiProperty({ description: '分页信息', type: PageMeta })
  meta!: PageMeta;

  constructor(list: T[], total: number, current: number, pageSize: number) {
    this.list = list;
    this.meta = {
      total,
      current,
      pageSize,
      pageCount: Math.ceil(total / pageSize) || 1,
    };
  }
}

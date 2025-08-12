import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Trim } from '@/common/transformers';

export class CreateDeptDto {
  @ApiProperty({ description: '部门名称' })
  @IsString()
  @Trim()
  @Length(4, 50)
  name!: string;

  @ApiProperty({ description: '部门编码' })
  @IsString()
  @Trim()
  @Length(4, 50)
  code!: string;

  @ApiProperty({ description: '父级部门' })
  @IsString()
  @Trim()
  @Length(4, 50)
  parentId?: string;
}

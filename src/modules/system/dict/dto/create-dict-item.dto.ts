import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { CommonStatus } from '@/common/database/entities';

export class CreateDictItemDto {
  @ApiProperty({ description: '所属字典ID' })
  @IsString()
  @IsNotEmpty()
  dictId!: string;

  @ApiProperty({ description: '显示文本', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label!: string;

  @ApiProperty({ description: '选项值', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  value!: string;

  @ApiPropertyOptional({
    description: '状态: 0-禁用 1-启用',
    enum: CommonStatus,
    default: CommonStatus.Enabled,
  })
  @IsEnum(CommonStatus)
  @IsOptional()
  status?: CommonStatus;

  @ApiPropertyOptional({ description: '排序(越小越靠前)', default: 100 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sort?: number;

  @ApiPropertyOptional({ description: '备注', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  remark?: string;
}

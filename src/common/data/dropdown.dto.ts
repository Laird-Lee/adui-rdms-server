import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class DropdownDto {
  @ApiProperty({ description: '显示文本' })
  @IsString()
  label!: string;

  @ApiProperty({ description: '选项值' })
  @IsString()
  value!: string;

  @ApiPropertyOptional({ description: '子节点', type: () => [DropdownDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DropdownDto)
  children?: DropdownDto[];
}

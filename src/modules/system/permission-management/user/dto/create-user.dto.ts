import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ToArray, Trim } from '@/common/transformers';

// 用户创建 DTO
export class CreateUserDto {
  @ApiProperty({ description: '用户名（登录账号），4-50 个字符' })
  @IsString()
  @Trim()
  @Length(4, 50)
  username!: string;

  @ApiProperty({ description: '用户昵称，1-100 个字符' })
  @IsString()
  @Trim()
  @Length(1, 100)
  nickname?: string;

  @ApiProperty({
    description: '密码（加密前原文由服务端自行校验并加密后存储），8-128 个字符',
  })
  @IsString()
  @Length(8, 128)
  password!: string;

  @ApiPropertyOptional({ description: '邮箱（可选）' })
  @IsOptional()
  @Trim()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: '手机号（可选），只校验基础格式' })
  @IsOptional()
  @Trim()
  @MaxLength(20)
  @Matches(/^[0-9+\-()\s]{6,20}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ApiPropertyOptional({ description: '头像 URL（可选），最长 255 字符' })
  @IsOptional()
  @Trim()
  @MaxLength(255)
  avatar?: string;

  @ApiPropertyOptional({
    description: '所属部门ID（可选），系统内字符串ID（nanoid）',
  })
  @IsOptional()
  @Trim()
  @IsString()
  @Length(5, 32)
  dept_id?: string;

  @ApiPropertyOptional({
    description: '所属岗位ID（可选），系统内字符串ID（nanoid）',
  })
  @IsOptional()
  @Trim()
  @IsString()
  @Length(5, 32)
  position_id?: string;

  @ApiProperty({
    description: '角色ID 列表（至少 1 个），系统内字符串ID（nanoid）',
    isArray: true,
    type: String,
  })
  @ToArray(',')
  @IsArray()
  @ArrayMinSize(1)
  @Matches(/^.{5,32}$/, {
    each: true,
    message: '角色ID长度需在 5~32 之间',
  })
  role_ids?: string[];
}

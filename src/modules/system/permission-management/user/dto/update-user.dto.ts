import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsArray,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ToArray, Trim } from '@/common/transformers';

// 用户更新 DTO（全部为可选字段）
// 如需限制“用户名不可修改”，请在业务层忽略该字段或移除它
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: '用户名（可选）' })
  @IsOptional()
  @IsString()
  @Trim()
  @Length(4, 50)
  username?: string;

  @ApiPropertyOptional({ description: '用户昵称（可选）' })
  @IsOptional()
  @IsString()
  @Trim()
  @Length(1, 100)
  nickname?: string;

  @ApiPropertyOptional({ description: '新密码（可选），8-128 个字符' })
  @IsOptional()
  @IsString()
  @Length(8, 128)
  password?: string;

  @ApiPropertyOptional({ description: '邮箱（可选）' })
  @IsOptional()
  @Trim()
  @MaxLength(100)
  // 继承了 CreateUserDto 的 IsEmail 校验，这里保持一致
  // 因为 PartialType 不会复制装饰器选项，这里不重复加 IsEmail，若需要更严格，可再加一次
  email?: string;

  @ApiPropertyOptional({ description: '手机号（可选）' })
  @IsOptional()
  @Trim()
  @MaxLength(20)
  @Matches(/^[0-9+\-()\s]{6,20}$/, { message: '手机号格式不正确' })
  phone?: string;

  @ApiPropertyOptional({ description: '头像 URL（可选）' })
  @IsOptional()
  @Trim()
  @MaxLength(255)
  avatar?: string;

  @ApiPropertyOptional({ description: '所属部门ID（可选）' })
  @IsOptional()
  @IsString()
  @Trim()
  @Length(5, 32)
  dept_id?: string;

  @ApiPropertyOptional({ description: '所属岗位ID（可选）' })
  @IsOptional()
  @IsString()
  @Trim()
  @Length(5, 32)
  position_id?: string;

  @ApiPropertyOptional({
    description: '角色ID 列表（可选），系统内字符串ID（nanoid）',
    isArray: true,
    type: String,
  })
  @IsOptional()
  @ToArray(',')
  @IsArray()
  @Matches(/^.{5,32}$/, {
    each: true,
    message: '角色ID长度需在 5~32 之间',
  })
  role_ids?: string[];
}

import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Dept } from '@/modules/system/org-structure/dept/entities/dept.entity';

export class DeptTreeDto extends OmitType(Dept, ['children'] as const) {
  @ApiPropertyOptional({ type: () => [DeptTreeDto] })
  children?: DeptTreeDto[];
}

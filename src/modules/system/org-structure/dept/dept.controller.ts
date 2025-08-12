import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PageQueryDto, PageResult } from '@/common/pagination/pagination.dto';
import { Dept } from '@/modules/system/org-structure/dept/entities/dept.entity';
import { DropdownDto } from '@/common/data/dropdown.dto';
import { DeptTreeDto } from '@/modules/system/org-structure/dept/dto/dept-tree.dto';

@ApiTags('部门相关')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @ApiOperation({ summary: '创建部门' })
  @Post()
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto);
  }

  @ApiOperation({ summary: '部门列表' })
  @Get()
  findAll() {
    return this.deptService.findAll();
  }

  @ApiOperation({ summary: '部门分页' })
  @ApiOkResponse({ type: PageResult<Dept> })
  @Get('page')
  async page(@Query() q: PageQueryDto) {
    return this.deptService.page(q);
  }

  @ApiOperation({ summary: '部门树形数据' })
  @ApiOkResponse({
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(DeptTreeDto) },
    },
  })
  @Get('tree')
  async tree() {
    return this.deptService.tree();
  }

  @ApiOperation({ summary: '部门下拉' })
  @ApiOkResponse({ type: [DropdownDto] })
  @Get('dropdown')
  dropdown(): Promise<DropdownDto[]> {
    return this.deptService.dropdown();
  }

  @ApiOperation({ summary: '部门详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deptService.findOne(id);
  }

  @ApiOperation({ summary: '更新部门' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeptDto: UpdateDeptDto) {
    return this.deptService.update(id, updateDeptDto);
  }

  @ApiOperation({ summary: '删除部门' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deptService.remove(id);
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Dept } from '@/modules/system/org-structure/dept/entities/dept.entity';
import { PageQueryDto } from '@/common/pagination/pagination.dto';
import { paginate } from '@/common/pagination/paginate';
import { DropdownDto } from '@/common/data/dropdown.dto';
import { DeptTreeDto } from '@/modules/system/org-structure/dept/dto/dept-tree.dto';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept) private readonly repo: Repository<Dept>,
  ) {}

  private normalize(value?: string | null): string | undefined {
    const v = (value ?? '').trim();
    return v.length ? v : undefined;
  }

  private async assertNameCodeUnique(
    name?: string | null,
    code?: string | null,
    excludeId?: string,
  ) {
    const n = this.normalize(name);
    const c = this.normalize(code);

    // 没有可校验的字段，直接返回
    if (!n && !c) return;

    const qb = this.repo.createQueryBuilder('d').select('1');

    // 用 Brackets 安全拼接 OR 条件，避免出现空括号
    qb.where(
      new Brackets((b) => {
        if (n) b.orWhere('d.name = :name', { name: n });
        if (c) b.orWhere('d.code = :code', { code: c });
      }),
    );

    if (excludeId) {
      qb.andWhere('d.id != :excludeId', { excludeId });
    }

    const exists = await qb.getExists();
    if (exists) {
      if (n && c) throw new ConflictException('部门名称或部门编码已存在');
      if (n) throw new ConflictException('部门名称已存在');
      throw new ConflictException('部门编码已存在');
    }
  }

  private mapParentIdPartial<T extends object>(input: T): T {
    // 未显式传入 parentId，保持原样
    if (!Object.prototype.hasOwnProperty.call(input, 'parentId')) {
      return input;
    }

    // 安全地拷贝为可变的记录类型
    const rec: Record<string, unknown> = {
      ...(input as unknown as Record<string, unknown>),
    };

    const v = rec.parentId; // unknown
    // 移除原字段
    delete rec.parentId;

    // 仅当存在 parentId（即非 undefined）时写入 parent_id
    if (v !== undefined) {
      // 允许 string 或 null；其他类型做字符串化兜底
      rec.parent_id = typeof v === 'string' ? v : v === null ? null : String(v);
    }

    return rec as unknown as T;
  }

  async create(createDeptDto: CreateDeptDto) {
    await this.assertNameCodeUnique(createDeptDto.name, createDeptDto.code);
    const payload = this.mapParentIdPartial(createDeptDto);
    const dept = this.repo.create(payload as unknown as Partial<Dept>);
    return this.repo.save(dept);
  }

  async findAll(): Promise<Dept[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Dept> {
    const dept = await this.repo.findOne({ where: { id } });
    if (!dept) {
      throw new NotFoundException(`Dept with id ${id} not found`);
    }
    return dept;
  }

  async update(id: string, updateDeptDto: UpdateDeptDto): Promise<Dept> {
    await this.assertNameCodeUnique(updateDeptDto.name, updateDeptDto.code, id);
    const payload = this.mapParentIdPartial(updateDeptDto);
    await this.repo.update(id, payload as unknown as Partial<Dept>);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Dept with id ${id} not found`);
    }
    return true;
  }

  async dropdown(): Promise<DropdownDto[]> {
    // 只取构建树所需字段并保持稳定排序
    const rows = await this.repo
      .createQueryBuilder('d')
      .select(['d.id', 'd.name', 'd.parentId', 'd.sort', 'd.created_at'])
      .orderBy('d.sort', 'ASC')
      .addOrderBy('d.createdAt', 'ASC')
      .getRawMany<{
        d_id: string;
        d_name: string;
        d_parent_id: string | null;
        d_sort: number;
        d_created_at: Date;
      }>();

    type Node = {
      id: string;
      name: string;
      parentId: string | null;
      children: Node[];
    };

    const nodeMap = new Map<string, Node>();
    const roots: Node[] = [];

    // 先建立所有节点
    for (const r of rows) {
      const id = r.d_id;
      nodeMap.set(id, {
        id,
        name: r.d_name,
        parentId: r.d_parent_id ?? null,
        children: [],
      });
    }

    // 再挂接父子关系
    for (const n of nodeMap.values()) {
      if (n.parentId && nodeMap.has(n.parentId)) {
        nodeMap.get(n.parentId)!.children.push(n);
      } else {
        roots.push(n);
      }
    }

    // 映射为下拉 DTO
    const toDto = (n: Node): DropdownDto => ({
      label: n.name,
      value: n.id,
      children: n.children.length ? n.children.map(toDto) : undefined,
    });

    return roots.map(toDto);
  }

  async page(q: PageQueryDto) {
    // 你可以先创建 qb 并加筛选条件
    const qb = this.repo.createQueryBuilder('d');

    // 如果有 keyword 等扩展查询字段，可以按需追加
    // if ((q as any).keyword) {
    //   const kw = `%${(q as any).keyword}%`;
    //   qb.andWhere('(u.username LIKE :kw OR u.nickname LIKE :kw)', { kw });
    // }

    return paginate<Dept>({
      query: q,
      qb,
      alias: 'u',
    });
  }

  async tree(): Promise<DeptTreeDto[]> {
    // 查询构建树所需字段（展开 Dept 的基础字段）
    const rows = await this.repo.find({
      order: { sort: 'ASC', createdAt: 'ASC' },
      loadRelationIds: false,
    });

    // 用 DeptTreeDto 作为节点（plain object 即可）
    const map = new Map<string, DeptTreeDto>();
    const roots: DeptTreeDto[] = [];

    for (const r of rows) {
      map.set(r.id, { ...(r as unknown as DeptTreeDto) });
    }

    for (const r of rows) {
      const node = map.get(r.id)!;
      const pid = r.parentId ?? '';
      if (pid && map.has(pid)) {
        const parent = map.get(pid)!;
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
}

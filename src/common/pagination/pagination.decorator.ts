import type { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PageQueryDto, PageResult } from './pagination.dto';

export interface PaginateOptions<T extends ObjectLiteral> {
  query: PageQueryDto;
  repo?: Repository<T>;
  qb?: SelectQueryBuilder<T>;
  // 可选：提供一个别名（当用 repo 时需要生成 qb）
  alias?: string;
  // 可选：指定允许排序的字段白名单
  orderableFields?: string[];
  // 可选：默认排序，如 { created_at: 'DESC' }
  defaultOrder?: Record<string, 'ASC' | 'DESC'>;
}

/**
 * 通用分页函数
 * - 支持 Repository 或 现有的 QueryBuilder
 * - 自动处理分页与排序（有白名单更安全）
 */
export async function paginate<T extends ObjectLiteral>(
  options: PaginateOptions<T>,
): Promise<PageResult<T>> {
  const { query, repo, alias = 't', orderableFields, defaultOrder } = options;

  const qb: SelectQueryBuilder<T> =
    options.qb ??
    (() => {
      if (!repo) {
        throw new Error('Either qb or repo must be provided');
      }
      return repo.createQueryBuilder(alias);
    })();

  // 排序处理
  const order: Record<string, 'ASC' | 'DESC'> = {};
  if (query.orderBy && query.order) {
    if (!orderableFields || orderableFields.includes(query.orderBy)) {
      order[`${alias}.${query.orderBy}`] = query.order;
    }
  }
  if (!Object.keys(order).length && defaultOrder) {
    for (const k of Object.keys(defaultOrder)) {
      order[`${alias}.${k}`] = defaultOrder[k];
    }
  }
  for (const [key, dir] of Object.entries(order)) {
    qb.addOrderBy(key, dir);
  }

  const page = Number(query.current) || 1;
  const pageSize = Number(query.pageSize) || 20;
  const skip = (page - 1) * pageSize;

  qb.skip(skip).take(pageSize);

  const [list, total] = await qb.getManyAndCount();
  return new PageResult<T>(list, total, page, pageSize);
}

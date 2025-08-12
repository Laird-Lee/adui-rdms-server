// 统一导出一次，避免重复实现/重复导出导致 TS2323/TS2393
export function toCamelCase(input: string): string {
  return input.replace(/_([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());
}

// 使用 unknown 替代 any，避免 no-unsafe-* 规则报警
export function camelCaseKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return (value as unknown[]).map((v) => camelCaseKeysDeep(v));
  }

  if (value && typeof value === 'object') {
    // 保留一些常见特殊对象原样返回
    if (
      value instanceof Date ||
      value instanceof Buffer ||
      value instanceof RegExp ||
      value instanceof Map ||
      value instanceof Set
    ) {
      return value;
    }

    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const newKey = toCamelCase(k);
      result[newKey] = camelCaseKeysDeep(v);
    }
    return result;
  }

  return value;
}

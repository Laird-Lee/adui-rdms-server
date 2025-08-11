import { Transform, TransformFnParams, Type } from 'class-transformer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 注册插件（幂等）
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

// 去除首尾空格
export function Trim() {
  return Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : (value as unknown),
  );
}

// 转小写
export function LowerCase() {
  return Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.toLowerCase() : (value as unknown),
  );
}

// 转大写
export function UpperCase() {
  return Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.toUpperCase() : (value as unknown),
  );
}

// 转 number（整数）
export function ToInt() {
  return Transform(({ value }: TransformFnParams): unknown => {
    if (value === null || value === undefined || value === '')
      return value as unknown;
    const n = Number.parseInt(String(value), 10);
    return Number.isNaN(n) ? (value as unknown) : n;
  });
}

// 转 number（浮点）
export function ToNumber() {
  return Transform(({ value }: TransformFnParams): unknown => {
    if (value === null || value === undefined || value === '')
      return value as unknown;
    const n = Number(String(value));
    return Number.isNaN(n) ? (value as unknown) : n;
  });
}

// 转 boolean（常见真值字符串）
export function ToBool() {
  const TRUE_SET = new Set(['true', '1', 'yes', 'on']);
  const FALSE_SET = new Set(['false', '0', 'no', 'off']);
  return Transform(({ value }: TransformFnParams): unknown => {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined || value === '')
      return value as unknown;
    const v = String(value).trim().toLowerCase();
    if (TRUE_SET.has(v)) return true;
    if (FALSE_SET.has(v)) return false;
    return value as unknown;
  });
}

/**
 * 使用 dayjs 自动解析日期并返回 Date
 * 支持：
 * - Date 实例（原样返回）
 * - 数字（视为毫秒/秒时间戳：10位按秒，13位按毫秒）
 * - 字符串（dayjs 默认解析，包含 ISO8601 等）
 * 校验失败将原样返回，交由 class-validator 的 @IsDate 等规则报错
 */
export function ToDate() {
  return Transform(({ value }: TransformFnParams): unknown => {
    if (value === null || value === undefined || value === '')
      return value as unknown;
    if (value instanceof Date) return value;

    // 数字时间戳
    if (typeof value === 'number') {
      const d =
        String(Math.abs(value)).length === 10
          ? dayjs.unix(value) // 秒
          : dayjs(value); // 毫秒
      return d.isValid() ? d.toDate() : (value as unknown);
    }

    // 纯数字字符串时间戳
    const s = String(value).trim();
    if (/^\d+$/.test(s)) {
      const num = Number(s);
      const d = s.length === 10 ? dayjs.unix(num) : dayjs(num);
      return d.isValid() ? d.toDate() : (value as unknown);
    }

    // 默认解析（ISO 等）
    const d = dayjs(s);
    return d.isValid() ? d.toDate() : (value as unknown);
  });
}

/**
 * 使用指定格式解析日期并返回 Date
 * @param formats - 单个或多个 dayjs 格式字符串，例如 'YYYY-MM-DD HH:mm:ss' 或 ['YYYY-MM-DD', 'YYYY/MM/DD']
 * @param strict - 严格模式（默认 true）
 */
export function ToDateWithFormat(formats: string | string[], strict = true) {
  const fmt = Array.isArray(formats) ? formats : [formats];
  return Transform(({ value }: TransformFnParams): unknown => {
    if (value === null || value === undefined || value === '')
      return value as unknown;
    if (value instanceof Date) return value;

    const s = String(value).trim();
    for (const f of fmt) {
      const d = dayjs(s, f, strict);
      if (d.isValid()) return d.toDate();
    }
    return value as unknown;
  });
}

/**
 * 按时区解析日期并返回 Date（会转换到该时区的具体时间）
 * 例如：ToDateTZ('Asia/Shanghai'), ToDateTZ('UTC')
 */
export function ToDateTZ(tz = 'UTC') {
  return Transform(({ value }: TransformFnParams): unknown => {
    if (value === null || value === undefined || value === '')
      return value as unknown;
    if (value instanceof Date) return value;

    // 字符串/数字统一交给 dayjs.tz 解析
    const s = String(value).trim();
    const d = dayjs.tz(s, tz);
    return d.isValid() ? d.toDate() : (value as unknown);
  });
}

// 转数组（支持单值 -> 数组，以及分隔字符串）
export function ToArray(separator = ',') {
  return Transform(({ value }: TransformFnParams): unknown[] => {
    if (Array.isArray(value)) return value as unknown[];
    if (value === null || value === undefined || value === '') return [];
    if (typeof value === 'string') {
      const arr: string[] = value
        .split(separator)
        .map((v) => v.trim())
        .filter((v) => v !== '');
      return arr as unknown[];
    }
    return [value as unknown];
  });
}

// 嵌套对象/数组类型声明（class-transformer 自带）
export { Type };

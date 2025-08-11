import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  type LoggerService,
} from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorBody<T = unknown> {
  code: number; // 使用 HTTP 状态码作为错误码
  message: string; // 错误消息
  error?: T; // 详细错误（如校验错误数组）
  timestamp: string; // ISO 时间戳
  path: string; // 请求路径
  requestId?: string; // 请求 ID
}

type AugmentedRequest = Request & { id?: string };

function getPath(req: Request): string {
  return req?.originalUrl ?? req.url ?? '';
}

function extractHttpExceptionPayload(exception: HttpException): {
  status: number;
  message: string;
  errorPayload?: unknown;
} {
  const status = exception.getStatus();
  const resp = exception.getResponse();
  // resp 可能是 string 或 object
  if (typeof resp === 'string') {
    return { status, message: resp };
  }
  // 将未知对象收窄成键值为 unknown 的字典
  const obj = resp as Record<string, unknown>;
  let message = 'Http Exception';
  let errorPayload: unknown;

  const msgVal = obj.message;
  const errVal = obj.error;

  if (typeof msgVal === 'string') {
    message = msgVal;
  } else if (Array.isArray(msgVal)) {
    // class-validator 常见为 string[]
    message = 'Validation failed';
    errorPayload = msgVal;
  } else if (typeof errVal === 'string') {
    message = errVal;
  }

  // 兼容我们自定义 ValidationPipe 的 { errors } 结构
  if (obj.errors !== undefined) {
    errorPayload = obj.errors;
  } else if (errorPayload === undefined) {
    // 兜底把原始对象作为 errorPayload，便于排查
    errorPayload = obj;
  }

  return { status, message, errorPayload };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger?: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<AugmentedRequest>();

    const path = getPath(req);
    const requestId = req.id;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errorPayload: unknown;

    if (exception instanceof HttpException) {
      const {
        status: s,
        message: m,
        errorPayload: p,
      } = extractHttpExceptionPayload(exception);
      status = s;
      message = m;
      errorPayload = p;
    } else if (exception instanceof Error) {
      message = exception.message || message;
      errorPayload = { name: exception.name, stack: exception.stack };
    } else {
      message = String(exception);
      errorPayload = exception;
    }

    const body: ErrorBody = {
      code: status,
      message,
      error: errorPayload,
      timestamp: new Date().toISOString(),
      path,
      requestId,
    };

    try {
      const stack = exception instanceof Error ? exception.stack : undefined;
      this.logger?.error?.(
        `[${status}] ${message} - ${path} - reqId=${requestId}`,
        stack,
        'AllExceptionsFilter',
      );
    } catch {
      // ignore logging errors
    }

    res.status(status).json(body);
  }
}

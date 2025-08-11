import {
  CallHandler,
  ExecutionContext,
  Injectable,
  type LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { nanoid } from 'nanoid';

type AugmentedRequest = Request & { id?: string };

function firstHeader(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0];
  return val;
}

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger?: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const http = context.switchToHttp();
    const req = http.getRequest<AugmentedRequest>();
    const res = http.getResponse<Response>();

    // 生成/透传 RequestId（优先使用请求头 x-request-id）
    const incomingId = firstHeader(req.headers['x-request-id']);
    const requestId: string =
      incomingId && incomingId.length > 0 ? incomingId : nanoid();
    req.id = requestId;
    res.setHeader('X-Request-Id', requestId);

    const method = req.method;
    const url = req.originalUrl || req.url;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          const status = res.statusCode;
          this.logger?.log?.(
            `${method} ${url} ${status} ${ms}ms reqId=${requestId}`,
            'HttpLogging',
          );
        },
        error: (err: unknown) => {
          const ms = Date.now() - start;
          const status = res.statusCode || 500;
          const msg = err instanceof Error ? err.message : String(err);
          this.logger?.error?.(
            `${method} ${url} ${status} ${ms}ms reqId=${requestId} - ${msg}`,
            err instanceof Error ? err.stack : undefined,
            'HttpLogging',
          );
        },
      }),
    );
  }
}

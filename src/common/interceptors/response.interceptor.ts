import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { SKIP_RESPONSE_WRAP } from '../decorators/skip-response-wrap.decorator';

interface SuccessBody<T = unknown> {
  code: number; // 0 表示成功
  message: string; // 文本提示
  data: T; // 业务数据
  timestamp: string; // ISO 时间戳
  path: string; // 请求路径
  requestId?: string; // 请求 ID
}

type AugmentedRequest = Request & { id?: string };

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const handler = context.getHandler();
    const cls = context.getClass();
    const skip =
      this.reflector.get<boolean>(SKIP_RESPONSE_WRAP, handler) ??
      this.reflector.get<boolean>(SKIP_RESPONSE_WRAP, cls);
    if (skip) return next.handle();

    const http = context.switchToHttp();
    const req = http.getRequest<AugmentedRequest>();

    return next.handle().pipe(
      map((data: unknown) => {
        const body: SuccessBody<unknown> = {
          code: 0,
          message: 'OK',
          data,
          timestamp: new Date().toISOString(),
          path: req.originalUrl ?? req.url ?? '',
          requestId: req.id,
        };
        return body;
      }),
    );
  }
}

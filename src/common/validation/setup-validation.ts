import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

function formatErrors(errors: ValidationError[], parent?: string): any[] {
  const list: any[] = [];
  for (const err of errors) {
    const propertyPath = parent ? `${parent}.${err.property}` : err.property;

    if (err.constraints) {
      list.push({
        field: propertyPath,
        messages: Object.values(err.constraints),
      });
    }
    if (err.children && err.children.length > 0) {
      list.push(...formatErrors(err.children, propertyPath));
    }
  }
  return list;
}

export function setupValidation(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 启用自动类型转换（依赖 class-transformer）
      whitelist: true, // 仅保留 DTO 中声明的属性
      forbidNonWhitelisted: true, // 非白名单属性直接报错
      validateCustomDecorators: true,
      stopAtFirstError: false,
      transformOptions: {
        // 根据 DTO 类型做隐式转换，例如 string -> number/boolean/date
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const details = formatErrors(errors);
        return new BadRequestException({
          code: 'VALIDATION_FAILED',
          message: '请求参数校验失败',
          errors: details,
        });
      },
    }),
  );
}

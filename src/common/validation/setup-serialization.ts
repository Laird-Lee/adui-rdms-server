import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export function setupSerialization(app: INestApplication) {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      // class-transformer 选项
      enableCircularCheck: false,
      exposeUnsetFields: false,
      // 当 DTO 使用 @Expose/@Exclude 时，以下选项可更严格：
      // strategy: 'excludeAll',
    }),
  );
}

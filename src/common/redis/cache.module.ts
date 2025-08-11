import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

// 注意：cache-manager-redis-store 需要动态导入以避免 ESM/CJS 兼容问题
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const { redisStore } = await import('cache-manager-redis-store');
        const host = config.get<string>('REDIS_HOST', '127.0.0.1');
        const port = parseInt(config.get<string>('REDIS_PORT', '6379'), 10);
        const password = config.get<string>('REDIS_PASSWORD');
        return {
          store: await redisStore({
            socket: { host, port },
            password,
            ttl: 60, // 默认 60 秒，可按需调整
          }),
        };
      },
    }),
  ],
  exports: [CacheModule],
})
export class AppCacheModule {}

import { Global, Module, type LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';
import { RedisService } from './redis.service';
import { createAppLogger } from '../logger/logger.factory';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<RedisClientType> => {
        // 使用封装好的 Winston logger（与全局配置保持一致）
        const logger: LoggerService = createAppLogger({
          level: process.env.LOG_LEVEL,
          logDir: process.env.LOG_DIR || 'logs',
        });

        const host = config.get<string>('REDIS_HOST', '127.0.0.1');
        const port = parseInt(config.get<string>('REDIS_PORT', '6379'), 10);
        const password = config.get<string>('REDIS_PASSWORD');
        const url =
          password && password.length > 0
            ? `redis://:${encodeURIComponent(password)}@${host}:${port}`
            : `redis://${host}:${port}`;

        const client: RedisClientType = createClient({
          url,
          socket: {
            reconnectStrategy(retries) {
              // 指数退避，最大 3 秒
              return Math.min(3000, retries * 100);
            },
          },
        });

        client.on('error', (err: unknown) => {
          const msg = err instanceof Error ? err.message : String(err);
          logger.error?.(
            `[Redis] Client error: ${msg}`,
            err instanceof Error ? err.stack : undefined,
            'RedisModule',
          );
        });

        client.on('connect', () => {
          logger.log?.('[Redis] Connected', 'RedisModule');
        });

        client.on('reconnecting', () => {
          logger.log?.('[Redis] Reconnecting...', 'RedisModule');
        });

        await client.connect();
        return client;
      },
    },
    {
      provide: RedisService,
      useFactory: (client: RedisClientType) => new RedisService(client),
      inject: [REDIS_CLIENT],
    },
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}

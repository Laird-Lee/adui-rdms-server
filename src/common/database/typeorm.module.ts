import { Module } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const isProd = config.get<string>('NODE_ENV') === 'production';

        const synchronize =
          config.get<string>('DB_SYNC')?.toLowerCase() === 'true'
            ? true
            : !isProd; // 生产默认关闭，开发默认开启

        const logging =
          config.get<string>('TYPEORM_LOGGING')?.toLowerCase() === 'true' ||
          !isProd;

        return {
          type: 'mysql',
          host: config.get<string>('DB_HOST', '127.0.0.1'),
          port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
          username: config.get<string>('DB_USER', 'root'),
          password: config.get<string>('DB_PASS', ''),
          database: config.get<string>('DB_NAME', 'test'),
          entities: [__dirname + '/../../**/*.entity{.ts,.js}'],

          synchronize,
          logging,

          // 其他可选配置
          charset: 'utf8mb4_unicode_ci',
          timezone: 'Z',
        };
      },
    }),
  ],
})
export class TypeOrmRootModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmRootModule } from '@/common/database/typeorm.module';
import { RedisModule } from '@/common/redis/redis.module';
import { UserModule } from './modules/system/permission-management/user/user.module';

@Module({
  imports: [
    // 全局配置模块：自动加载 .env，支持变量展开与缓存
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      // 可按需指定多个环境文件优先级，例如：
      // envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      // 这里保持默认从 .env 加载
    }),
    TypeOrmRootModule,
    RedisModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

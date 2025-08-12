import 'dotenv/config'; // 启动时加载 .env
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { createAppLogger } from './common/logger/logger.factory';
import { setupSwagger } from './common/swagger/setup-swagger';
import os from 'node:os';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { ResponseTransformInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { CamelCaseInterceptor } from '@/common/interceptors/camel-case.interceptor';

function getLocalIp(): string {
  const ifaces = os.networkInterfaces();
  for (const key of Object.keys(ifaces)) {
    const list = ifaces[key] || [];
    for (const item of list) {
      if (
        item &&
        item.family === 'IPv4' &&
        !item.internal &&
        item.address &&
        !item.address.startsWith('169.254.')
      ) {
        return item.address;
      }
    }
  }
  return '127.0.0.1';
}

function normalizeBasePath(p?: string): {
  basePath: string;
} {
  // 期望：输入 '/dev-api' -> basePath: '/dev-api'
  // 留空或 '/' 则 basePath: ''，basePathWithSlash: ''
  const raw = (p ?? '').trim();
  if (!raw || raw === '/') return { basePath: '' };
  const leading = raw.startsWith('/') ? raw : `/${raw}`;
  const noTrail = leading.replace(/\/+$/, '');
  return { basePath: noTrail };
}

async function bootstrap() {
  const logger = createAppLogger({
    level: process.env.LOG_LEVEL,
    logDir: process.env.LOG_DIR || 'logs',
  });

  const app = await NestFactory.create(AppModule, { logger });

  app.useGlobalInterceptors(new HttpLoggingInterceptor(logger));
  app.useGlobalInterceptors(
    new ResponseTransformInterceptor(app.get(Reflector)),
  );
  app.useGlobalInterceptors(new CamelCaseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  // 读取并规范化接口前缀
  const { basePath } = normalizeBasePath(process.env.API_BASE_PATH);
  if (basePath) {
    // 设置全局路由前缀（会影响所有控制器路由）
    app.setGlobalPrefix(basePath.replace(/^\//, ''));
  }

  // Swagger（默认仅非生产环境开启，可用 SWAGGER_ENABLED=false 关闭）
  const swaggerEnabled =
    process.env.SWAGGER_ENABLED !== 'false' &&
    process.env.NODE_ENV !== 'production';
  setupSwagger(app, {
    enabled: swaggerEnabled,
    title: 'ADui RDMS API',
    description: '企业研发项目管理系统 API',
    version: '1.0.0',
    docsPath: process.env.SWAGGER_PATH || '/docs',
    jsonPath: process.env.OPENAPI_JSON_PATH || '/openapi-json',
    bearerAuth: true,
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`
 █████╗ ██████╗ ██╗   ██╗██╗    ██████╗ ██████╗ ███╗   ███╗███████╗    ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗ 
██╔══██╗██╔══██╗██║   ██║██║    ██╔══██╗██╔══██╗████╗ ████║██╔════╝    ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
███████║██║  ██║██║   ██║██║    ██████╔╝██║  ██║██╔████╔██║███████╗    ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝
██╔══██║██║  ██║██║   ██║██║    ██╔══██╗██║  ██║██║╚██╔╝██║╚════██║    ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗
██║  ██║██████╔╝╚██████╔╝██║    ██║  ██║██████╔╝██║ ╚═╝ ██║███████║    ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║
╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝    ╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚══════╝    ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝
`);

  const localIp = getLocalIp();
  logger.log?.(
    `Server started:
              - localhost:  http://localhost:${port}${basePath}
              - LAN IP:     http://${localIp}:${port}${basePath}`,
    'Bootstrap',
  );

  if (swaggerEnabled) {
    const docsPath = String(process.env.SWAGGER_PATH || '/docs').replace(
      /^\/+/,
      '',
    );
    logger.log?.(
      `Swagger UI:
              - localhost:  http://localhost:${port}/${docsPath}
              - LAN IP:     http://${localIp}:${port}/${docsPath}`,
      'Bootstrap',
    );
  }
}

void bootstrap();

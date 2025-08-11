import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerOptions {
  enabled?: boolean; // 是否启用 Swagger（默认：NODE_ENV !== 'production'）
  title?: string; // 文档标题
  description?: string; // 文档描述
  version?: string; // API 版本
  docsPath?: string; // Swagger UI 路径（默认：/docs）
  jsonPath?: string; // OpenAPI JSON 路径（默认：/openapi-json）
  bearerAuth?: boolean; // 是否启用 Bearer 鉴权（默认：true）
}

export function setupSwagger(app: INestApplication, opts: SwaggerOptions = {}) {
  const {
    enabled = process.env.NODE_ENV !== 'production',
    title = 'API',
    description = 'API Documentation',
    version = '1.0.0',
    docsPath = '/docs',
    jsonPath = '/openapi-json',
    bearerAuth = true,
  } = opts;

  if (!enabled) return;

  const builder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version);
  const config = (bearerAuth ? builder.addBearerAuth() : builder).build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(trimSlash(docsPath), app, document);

  // 提供原始 openapi.json
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get(trimSlash(jsonPath), (req, res) => {
    res.type('application/json').send(document);
  });
}

function trimSlash(path: string) {
  return path.replace(/^\/+/, '');
}

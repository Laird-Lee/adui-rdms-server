import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import winston from 'winston';
import path from 'node:path';
import fs from 'node:fs';

export interface LoggerConfig {
  level?: string; // 日志级别（默认：info，开发环境默认：debug）
  logDir?: string; // 文件日志目录（默认：logs）
  enableFile?: boolean; // 是否写入文件（默认：true）
  enableConsole?: boolean; // 是否输出控制台（默认：true）
}

export function createAppLogger(config: LoggerConfig = {}): LoggerService {
  const isProd = process.env.NODE_ENV === 'production';
  const level = config.level ?? (isProd ? 'info' : 'debug');
  const logDir = config.logDir ?? 'logs';
  const enableFile = config.enableFile ?? true;
  const enableConsole = config.enableConsole ?? true;

  const formats = [
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
  ];

  const consoleFormat = isProd
    ? winston.format.combine(...formats, winston.format.json())
    : winston.format.combine(
        ...formats,
        winston.format.colorize({ all: true }),
        nestWinstonModuleUtilities.format.nestLike('ADui-RDMS', {
          colors: true,
          prettyPrint: true,
        }),
      );

  const transports: winston.transport[] = [];

  if (enableConsole) {
    transports.push(
      new winston.transports.Console({
        level,
        format: consoleFormat,
      }),
    );
  }

  if (enableFile) {
    ensureDir(logDir);
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, 'app.log'),
        level,
        format: winston.format.combine(...formats, winston.format.json()),
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
      }),
    );
    transports.push(
      new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        format: winston.format.combine(...formats, winston.format.json()),
        maxsize: 10 * 1024 * 1024,
        maxFiles: 5,
      }),
    );
  }

  return WinstonModule.createLogger({
    level,
    transports,
  });
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

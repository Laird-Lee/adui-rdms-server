<div align="center">
  <a href="https://github.com/Laird-Lee/adui-rdms">
    <img alt="ADui RDMS Logo" width="215" src="https://github.com/Laird-Lee/adui-rdms/blob/main/public/logo.svg">
  </a>

  <h1>ADui RDMS Server</h1>

  <p>企业研发项目管理系统后端服务，提供项目管理、任务协作、需求追踪、缺陷管理、资源分配等核心 API 与数据支持</p>

[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.x-3178C6.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A518.x-339933.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-See%20LICENSE-informational.svg)](LICENSE)

</div>


## 📚 项目介绍

ADui-RDMS Server 是 ADui-RDMS（企业研发项目管理系统）的服务端实现，负责处理业务逻辑、数据存储与接口提供。配合前端（ADui-RDMS Web）使用，构成完整的研发项目管理解决方案。

## ✨ 功能特性

- 🛠 提供项目、任务、需求、缺陷等核心管理 API
- 🔐 内置用户认证与权限控制
- 📊 数据统计与分析接口
- 🔄 支持第三方系统集成（GitLab / Jenkins / LDAP 等）
- 📦 模块化架构，易于扩展

## 🛠 技术栈

- 开发语言：TypeScript / JavaScript（Node.js）
- Web 框架：NestJS
- 数据库：PostgreSQL / MySQL
- 缓存：Redis
- 接口文档：Swagger / OpenAPI
- 鉴权：JWT + RBAC 权限模型
- 部署方式：Docker / Docker Compose

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- PostgreSQL 或 MySQL 数据库
- Redis

### 安装依赖
```bash
pnpm install
```

### 启动开发环境
```bash
pnpm run start:dev
```

### 生产构建与启动
```bash
pnpm run build
pnpm run start:prod
```

### 运行测试
```bash
pnpm run test
```

## 📂 目录结构（示例）
```
adui-rdms-server/
├── src/
│   ├── modules/        # 业务模块
│   ├── common/         # 公共工具与拦截器
│   ├── config/         # 配置文件
│   ├── main.ts         # 入口文件
│   └── app.module.ts   # 应用主模块
├── test/               # 单元测试
├── docker/             # Docker 配置
├── package.json
└── README.md
```

## 📄 License

[MIT](LICENSE) © 2025 ADui

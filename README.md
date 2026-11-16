# Address Book（通讯录）— Extreme Programming

一个前后端分离的通讯录应用，支持**收藏联系人**、**多联系方式**、**Excel 导入 / 导出**，
并提供收藏星标、收藏行高亮、姓名搜索与响应式页面样式。

- 课程：**EE308FZ Software Engineering (FZU–MU)**
- 队名：**832401112-832401219**
- 成员：**黄志远（832401112）**、**王少杰（832401219）**
- 仓库：<https://github.com/JorgeHUANG7/extreme-programming-832401112-832401219>
- 代码规范：[docs/code-style.md](docs/code-style.md)
- 部署指南：[docs/deploy.md](docs/deploy.md)
- 作业博客：[docs/blog.md](docs/blog.md)
- 公网应用：**<!-- TODO: 部署后填写公网地址，例如 http://1.2.3.4:8080/index.html -->**

## 功能

| 功能 | 说明 |
| --- | --- |
| 联系人管理 | 新增 / 编辑 / 删除 / 列表 |
| 收藏（书签） | 列表内 ★ / ☆ 一键切换；收藏行黄色高亮；`collect.html` 集中展示收藏 |
| 搜索 | 按姓名实时搜索（300ms 防抖），收藏页支持在收藏内搜索 |
| 多联系方式 | 手机号码、家庭电话、邮箱、社交媒体、真实地址、头像 |
| 导出 Excel | 每个联系人一行，每个字段一列，`.xlsx` 直接下载 |
| 导入 Excel | 读取符合模板的 `.xlsx` / `.xls`，逐行入库；姓名或手机为空的行自动跳过并统计 |
| 页面样式 | 独立 CSS / JS、卡片式布局、弹窗表单、移动端适配 |

## 技术栈

- **前端**：HTML + CSS + 原生 JavaScript（Fetch API）
- **后端**：Spring Boot 2.3.12、MyBatis-Plus、EasyExcel
- **数据库**：MySQL 8.x
- **头像存储**：阿里云 OSS（可选，不配置不影响其他功能）
- **部署**：Docker Compose（MySQL + 后端 + Nginx 静态前端）

## 目录结构

```
.
├── backend/                     Spring Boot 应用
│   ├── pom.xml
│   ├── Dockerfile
│   ├── mvnw / mvnw.cmd          Maven Wrapper
│   └── src/main/java/com/example/files/
│       ├── controller/          REST 接口
│       ├── entity/              User 实体
│       ├── mapper/              MyBatis-Plus Mapper
│       ├── service/             业务接口与实现
│       └── utils/               Excel / 文件 / CORS / MyBatis 配置
├── frontend/
│   ├── index.html               联系人列表
│   ├── collect.html             我的收藏
│   ├── css/index.css
│   └── js/ (config.js, index.js, collect.js)
├── database/schema.sql          建库建表 + 示例数据
├── docs/
│   ├── blog.md                  作业博客
│   ├── code-style.md            代码规范
│   ├── deploy.md                云部署指南
│   └── images/                  截图
└── docker-compose.yml
```

## 快速开始

### 方式一：Docker Compose（推荐，评审复现最省事）

```bash
# 可选：修改数据库 root 密码
export DB_PASSWORD=123456
docker compose up -d --build
```

- 前端：<http://localhost:8080/index.html>
- 后端：<http://localhost:8888/list>

首次启动会自动执行 `database/schema.sql` 建库建表。

### 方式二：本地运行

环境要求：

- **JDK 8 或 11**（Spring Boot 2.3.x + Lombok 不支持 JDK 17+ 编译）
- MySQL 8.x
- 浏览器（前端不需要 Node.js）

```bash
# 1. 建库（默认库名 phonebook；Windows 下务必指定 utf8mb4，避免中文乱码）
mysql --default-character-set=utf8mb4 -u root -p < database/schema.sql

# 2. 启动后端
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run

# 3. 打开前端
#    直接双击 frontend/index.html，或用任意静态服务器
```

数据库连接通过环境变量覆盖，默认值见 `backend/src/main/resources/application.yml`：

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=phonebook
export DB_USERNAME=root
export DB_PASSWORD=123456
```

头像上传是可选功能，需要自己的阿里云 OSS：

```bash
export ALI_OSS_ENDPOINT=...
export ALI_OSS_BUCKET=...
export ALI_OSS_ACCESS_KEY_ID=...
export ALI_OSS_ACCESS_KEY_SECRET=...
export ALI_OSS_ADDRESS=...
```

> 未配置 OSS 时，除头像上传外的所有功能均可正常使用。

## REST API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/list?name=` | 联系人列表，`name` 为可选的姓名模糊搜索 |
| GET | `/collectList` | 收藏联系人列表（`collect = 2`） |
| POST | `/add` | 新增联系人 |
| PUT | `/update` | 修改联系人 |
| DELETE | `/delete?id=` | 删除联系人 |
| PUT | `/toggleBookmark` | 切换收藏状态 |
| GET | `/export` | 导出全部联系人到 Excel |
| POST | `/importExcel` | 从 Excel 导入，返回 `ok:成功数:跳过数` 或 `error:原因` |
| POST | `/uploadImage` | 上传头像（需配置 OSS） |

## Excel 格式

导出列（每个联系人一行）：

`用户名 | 手机号码 | 家庭电话 | 邮箱地址 | 社交媒体 | 真实地址`

导入时表头需与上述列名一致；`用户名` 与 `手机号码` 为必填，
缺失的行会被跳过，导入结束后前端提示成功 / 跳过条数。

## 团队协作

- 代码规范与提交信息约定见 [docs/code-style.md](docs/code-style.md)；
- 分支模型：`main` 为稳定分支，功能开发使用 `feature/*`，通过 Pull Request 合并；
- 版本发布使用 Git Tag + GitHub Release。

# 代码规范（Code Style Guide）

本文件是本项目的编码与协作规范，所有成员在提交代码前都应遵守。
适用范围：`backend/`（Java / Spring Boot）、`frontend/`（HTML / CSS / JavaScript）、`database/`（SQL）以及文档。

## 1. 分支与协作流程

| 分支 | 用途 |
| --- | --- |
| `main` | 随时可运行、可演示的稳定分支，只接受 PR 合并 |
| `feature/<功能>` | 新功能，例如 `feature/excel-import` |
| `fix/<问题>` | 缺陷修复，例如 `fix/import-empty-row` |
| `docs/<主题>` | 纯文档修改 |

流程：

1. 从最新 `main` 创建分支：`git checkout -b feature/xxx`；
2. 本地开发、自测，提交信息遵循第 5 节；
3. 推送分支并创建 Pull Request，PR 描述中写清「改了什么 / 怎么验证 / 影响范围」；
4. 至少 1 名其他成员 Review 通过后合并，禁止直接向 `main` 强推；
5. 合并后删除功能分支。

## 2. Java 规范

- 缩进 4 个空格，不使用 Tab；单行不超过 120 字符。
- 类名 `UpperCamelCase`，方法与变量 `lowerCamelCase`，常量 `UPPER_SNAKE_CASE`。
- 包名全小写：`controller` / `service` / `service.impl` / `mapper` / `entity` / `utils`。
- Controller 只做参数校验与转发，业务逻辑放在 Service，数据库访问放在 Mapper。
- 对外接口统一返回 JSON；失败时返回可读的错误信息，不返回 `null` 让前端猜测。
- 所有 `public` 方法和非直观逻辑必须写 Javadoc / 行内注释，说明「为什么」而不只是「做了什么」。
- 禁止在代码中硬编码数据库密码、AccessKey 等敏感信息，统一用 `application.yml` 中的环境变量占位符。
- 异常必须记录日志（`@Slf4j`）并转换为对用户友好的提示，禁止只 `printStackTrace()`。

## 3. 前端规范

- HTML：标签小写、属性使用双引号、层级缩进 4 个空格；页面结构保持「容器 + 工具栏 + 表格 + 弹窗」的统一布局。
- CSS：类名 `kebab-case`；优先使用类选择器，避免用 ID 控制样式；颜色、圆角、阴影等复用统一变量或统一取值。
- JavaScript：
  - 变量与函数 `lowerCamelCase`，常量 `UPPER_SNAKE_CASE`；
  - 使用 `const` / `let`，禁止 `var`；
  - 网络请求统一走 `fetch` + `async/await` 或 `.then()`，必须处理失败分支；
  - 拼接用户输入到 URL 时使用 `encodeURIComponent`；
  - 渲染用户数据使用 `textContent`，禁止直接 `innerHTML` 拼接，避免 XSS。
- 前后端接口地址统一从 `js/config.js` 的 `API_BASE` 读取，禁止在业务代码里写死 `localhost`。

## 4. 数据库规范

- 表名、字段名使用 `snake_case`，字段必须有 `COMMENT`。
- 主键统一 `id INT AUTO_INCREMENT`；必填字段加 `NOT NULL`。
- 结构变更同步更新 `database/schema.sql`，保证新环境可以一键建库。
- 示例数据与建表语句放在同一文件中，方便评审复现。

## 5. 提交信息规范（Conventional Commits）

格式：

```
<type>(<scope>): <简短说明>
```

常用 type：

| type | 含义 |
| --- | --- |
| `feat` | 新功能 |
| `fix` | 缺陷修复 |
| `docs` | 文档 |
| `style` | 格式调整（不影响逻辑） |
| `refactor` | 重构 |
| `chore` | 构建、配置、依赖 |

示例：

```
feat(frontend): add star button and collected-row highlight
fix(backend): skip rows without name or phone when importing Excel
docs: add code style guide
```

要求：

- 一次提交只做一件事，避免「超大提交」；
- 提交信息用英文或中文均可，但同一仓库保持一致；
- 不提交 `target/`、IDE 配置、日志、密钥文件（已在 `.gitignore` 中忽略）。

## 6. PR 检查清单

- [ ] 代码可编译/可运行，核心流程自测通过；
- [ ] 没有新增编译警告或明显 ESLint 问题；
- [ ] 新增/修改的接口已同步更新 README；
- [ ] 数据库变更已写入 `database/schema.sql`；
- [ ] 提交信息符合规范，PR 描述包含验证步骤；
- [ ] 至少 1 名成员 Review 通过。

## 7. 代码评审原则

- 评审关注正确性、可读性、边界条件与安全性，不纠结个人风格；
- 评论使用「建议 / 问题 / 必须修改」区分严重程度；
- 作者需逐条回复评论，修改后重新请求评审；
- 有分歧时以本规范与课程要求为准，必要时在 PR 中记录结论。

# 云服务器部署指南（华为云 / 阿里云）

目标：把应用部署到公网，评审者可通过公网 IP 访问（`localhost` 不计分）。

部署结构：

| 组件 | 端口 | 说明 |
| --- | --- | --- |
| Nginx（静态前端） | `8080`（或 `80`） | 托管 `frontend/` |
| Spring Boot 后端 | `8888` | 提供 REST API |
| MySQL 8 | `3306`（仅容器网络） | 数据存储 |

前端 `js/config.js` 会自动把 API 地址指向「当前访问主机的 8888 端口」，因此
用公网 IP 打开页面后无需改代码即可连到后端。

## 1. 准备服务器

- 规格：2 核 2G 及以上，Ubuntu 22.04 / CentOS 7+ 均可；
- 安全组 / 防火墙放行：`22`（SSH）、`8080`（前端）、`8888`（后端）；
- 安装 Docker 与 Docker Compose：

```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
docker compose version
```

> 华为云 / 阿里云镜像源可加速 Docker 安装；若 `docker compose` 不可用，安装
> `docker-compose-plugin` 或使用 `docker-compose` 命令。

## 2. 拉取代码并启动

```bash
git clone https://github.com/<team-owner>/<repo>.git
cd <repo>
# 可选：修改数据库密码
export DB_PASSWORD='your-strong-password'
docker compose up -d --build
```

首次启动会自动执行 `database/schema.sql` 建库建表。

检查状态：

```bash
docker compose ps
docker compose logs -f backend
curl http://127.0.0.1:8888/list
```

## 3. 访问应用

浏览器打开：

```
http://<服务器公网IP>:8080/index.html
```

如果打不开：

1. 确认安全组已放行 `8080`、`8888`；
2. 确认容器都在运行：`docker compose ps`；
3. 后端日志无数据库连接错误：`docker compose logs backend`；
4. 浏览器 F12 查看请求是否指向 `http://<公网IP>:8888`；
5. 若中文显示为 `?` 或乱码，检查数据库初始化时是否使用了
   `--default-character-set=utf8mb4`。

## 4. 更新版本

```bash
git pull
docker compose up -d --build backend
```

## 5. 可选：域名与 HTTPS

- 域名 A 记录指向服务器公网 IP；
- 用 Nginx 反向代理 80/443 到 `127.0.0.1:8080`，并为 `8888` 配置 `/api/` 反向代理；
- 使用 `certbot --nginx` 申请免费证书；
- 若使用域名，确认 `frontend/js/config.js` 的 `API_BASE` 指向正确的 API 域名。

## 6. 本地演示（不使用 Docker）

1. 安装 JDK 8 或 11（Spring Boot 2.3.x 不支持 JDK 17+ 编译）；
2. 安装 MySQL 8，执行 `mysql --default-character-set=utf8mb4 -u root -p < database/schema.sql`（Windows 客户端默认字符集可能不是 utf8mb4，不指定会出现中文乱码）；
3. `cd backend && ./mvnw spring-boot:run`（Windows 用 `mvnw.cmd`）；
4. 直接双击 `frontend/index.html` 或起一个静态服务器访问。

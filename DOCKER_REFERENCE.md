# Docker 快速参考

## 常用命令

### 拉取和运行

```bash
# 从 Docker Hub 拉取最新镜像
docker pull shindouhiro/calendar-todo:latest

# 运行容器（端口 3000）
docker run -d -p 3000:80 --name calendar-todo shindouhiro/calendar-todo:latest

# 运行容器（自定义端口）
docker run -d -p 8080:80 --name calendar-todo shindouhiro/calendar-todo:latest
```

### 容器管理

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 停止容器
docker stop calendar-todo

# 启动容器
docker start calendar-todo

# 重启容器
docker restart calendar-todo

# 删除容器
docker rm calendar-todo

# 强制删除运行中的容器
docker rm -f calendar-todo
```

### 日志和调试

```bash
# 查看容器日志
docker logs calendar-todo

# 实时查看日志
docker logs -f calendar-todo

# 查看最近 100 行日志
docker logs --tail 100 calendar-todo

# 进入容器 shell
docker exec -it calendar-todo sh

# 查看容器详细信息
docker inspect calendar-todo

# 查看容器资源使用
docker stats calendar-todo
```

### 镜像管理

```bash
# 列出本地镜像
docker images

# 删除镜像
docker rmi shindouhiro/calendar-todo:latest

# 清理未使用的镜像
docker image prune

# 清理所有未使用的资源
docker system prune -a
```

## Docker Compose 命令

```bash
# 启动服务（后台运行）
docker-compose up -d

# 启动服务（前台运行，查看日志）
docker-compose up

# 停止服务
docker-compose down

# 停止并删除卷
docker-compose down -v

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs

# 实时查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 重新构建并启动
docker-compose up -d --build

# 拉取最新镜像
docker-compose pull

# 拉取并重启
docker-compose pull && docker-compose up -d
```

## 本地构建

```bash
# 构建镜像
docker build -t calendar-todo .

# 构建时不使用缓存
docker build --no-cache -t calendar-todo .

# 构建并指定标签
docker build -t calendar-todo:v1.0.0 .

# 多架构构建（需要 buildx）
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t calendar-todo .
```

## 健康检查

```bash
# 检查容器健康状态
docker inspect --format='{{.State.Health.Status}}' calendar-todo

# 手动测试健康检查端点
curl http://localhost:3000/health

# 在容器内测试
docker exec calendar-todo wget --spider http://localhost/health
```

## 更新应用

### 方法 1: 使用 Docker 命令

```bash
# 1. 拉取最新镜像
docker pull shindouhiro/calendar-todo:latest

# 2. 停止并删除旧容器
docker stop calendar-todo && docker rm calendar-todo

# 3. 启动新容器
docker run -d -p 3000:80 --name calendar-todo shindouhiro/calendar-todo:latest
```

### 方法 2: 使用 Docker Compose

```bash
# 一键更新
docker-compose pull && docker-compose up -d
```

### 方法 3: 使用脚本

创建 `update.sh`:

```bash
#!/bin/bash
docker pull shindouhiro/calendar-todo:latest
docker stop calendar-todo
docker rm calendar-todo
docker run -d -p 3000:80 --name calendar-todo shindouhiro/calendar-todo:latest
echo "Updated to latest version"
```

运行：
```bash
chmod +x update.sh
./update.sh
```

## 故障排查

### 容器无法启动

```bash
# 查看错误日志
docker logs calendar-todo

# 检查端口是否被占用
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# 使用不同端口
docker run -d -p 8080:80 --name calendar-todo shindouhiro/calendar-todo:latest
```

### 无法访问应用

```bash
# 检查容器是否运行
docker ps

# 检查容器健康状态
docker inspect calendar-todo | grep Health -A 10

# 测试容器内部
docker exec calendar-todo wget -O- http://localhost/

# 检查防火墙设置
```

### 镜像拉取失败

```bash
# 检查网络连接
ping hub.docker.com

# 使用镜像加速器（中国用户）
# 编辑 /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com"
  ]
}

# 重启 Docker
sudo systemctl restart docker
```

## 性能优化

### 资源限制

```bash
# 限制内存和 CPU
docker run -d \
  --memory="512m" \
  --cpus="1.0" \
  -p 3000:80 \
  --name calendar-todo \
  shindouhiro/calendar-todo:latest
```

### 使用 Docker Compose 设置资源限制

```yaml
services:
  calendar-todo:
    image: shindouhiro/calendar-todo:latest
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

## 备份和恢复

### 导出容器

```bash
# 导出容器为 tar 文件
docker export calendar-todo > calendar-todo-backup.tar

# 从 tar 文件导入
docker import calendar-todo-backup.tar calendar-todo:backup
```

### 保存镜像

```bash
# 保存镜像为 tar 文件
docker save shindouhiro/calendar-todo:latest > calendar-todo-image.tar

# 加载镜像
docker load < calendar-todo-image.tar
```

## 网络配置

### 自定义网络

```bash
# 创建网络
docker network create calendar-network

# 在自定义网络中运行
docker run -d \
  --network calendar-network \
  --name calendar-todo \
  -p 3000:80 \
  shindouhiro/calendar-todo:latest

# 查看网络
docker network ls

# 查看网络详情
docker network inspect calendar-network
```

## 环境变量

虽然此应用不需要环境变量，但如果需要可以这样设置：

```bash
# 设置环境变量
docker run -d \
  -e NODE_ENV=production \
  -p 3000:80 \
  --name calendar-todo \
  shindouhiro/calendar-todo:latest
```

## 卷挂载

如果需要持久化数据或自定义配置：

```bash
# 挂载自定义 nginx 配置
docker run -d \
  -v $(pwd)/custom-nginx.conf:/etc/nginx/conf.d/default.conf \
  -p 3000:80 \
  --name calendar-todo \
  shindouhiro/calendar-todo:latest
```

## 有用的别名

添加到 `~/.bashrc` 或 `~/.zshrc`:

```bash
# Calendar Todo 别名
alias ctd-start='docker start calendar-todo'
alias ctd-stop='docker stop calendar-todo'
alias ctd-restart='docker restart calendar-todo'
alias ctd-logs='docker logs -f calendar-todo'
alias ctd-update='docker pull shindouhiro/calendar-todo:latest && docker stop calendar-todo && docker rm calendar-todo && docker run -d -p 3000:80 --name calendar-todo shindouhiro/calendar-todo:latest'
```

使用：
```bash
ctd-start    # 启动
ctd-stop     # 停止
ctd-restart  # 重启
ctd-logs     # 查看日志
ctd-update   # 更新到最新版本
```

## 相关链接

- [Docker Hub 仓库](https://hub.docker.com/r/shindouhiro/calendar-todo)
- [GitHub 仓库](https://github.com/shindouhiro/calendar-todo)
- [详细部署文档](./DEPLOYMENT.md)
- [GitHub Actions 设置](./.github/ACTIONS_SETUP.md)

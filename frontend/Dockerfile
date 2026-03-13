# 使用官方 Ubuntu 基础镜像
FROM ubuntu
# # 安装 Node.js 和 npm
# RUN apt-get update && \
#    apt-get install -y curl gnupg && \
#    curl -sL https://deb.nodesource.com/setup_20.x | bash - && \
#    apt-get install -y nodejs
# 安装 Nginx
RUN apt-get install -y nginx && \
   apt-get clean && \
   rm -rf /var/lib/apt/lists/*
# 设置工作目录
WORKDIR /app
COPY ./dist ./dist
# 将构建好的 React 应用复制到 Nginx 的目录下
RUN cp -r dist/* /var/www/html/
# 复制 Nginx 配置文件到容器
COPY ./default.conf /etc/nginx/sites-available/default
# 映射出来的 Nginx 配置目录
VOLUME /etc/nginx/sites-enabled
# 暴露 80 端口
EXPOSE 80
# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]
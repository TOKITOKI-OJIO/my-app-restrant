# Restaurant Backend API

这是一个使用 Go、Gin 和 GORM 构建的餐厅后端 API。

## 项目结构

```
backend/
├── main.go              # 应用入口
├── config/              # 配置文件
│   └── database.go      # 数据库连接配置
├── models/              # 数据模型
│   ├── user.go          # 用户模型
│   ├── menu_item.go     # 菜单项模型
│   └── order.go         # 订单模型
├── handlers/            # 处理器
│   ├── user_handler.go  # 用户处理器
│   ├── menu_handler.go  # 菜单处理器
│   └── order_handler.go # 订单处理器
├── routers/             # 路由
│   └── routes.go        # 路由配置
└── utils/               # 工具函数
```

## 技术栈

- Go 1.18+
- Gin Web Framework
- GORM (ORM)
- MySQL

## 安装依赖

```bash
cd backend
go mod download
```

## 配置数据库

1. 复制 `.env.example` 为 `.env`
2. 修改数据库连接信息

```bash
cp .env.example .env
```

## 运行项目

```bash
go run main.go
```

服务器将在 `http://localhost:8080` 启动。

## API 端点

### 用户 API
- `GET /api/v1/users` - 获取所有用户
- `GET /api/v1/users/:id` - 获取单个用户
- `POST /api/v1/users` - 创建用户
- `PUT /api/v1/users/:id` - 更新用户
- `DELETE /api/v1/users/:id` - 删除用户

### 菜单 API
- `GET /api/v1/menu` - 获取所有菜单项
- `GET /api/v1/menu/:id` - 获取单个菜单项
- `POST /api/v1/menu` - 创建菜单项
- `PUT /api/v1/menu/:id` - 更新菜单项
- `DELETE /api/v1/menu/:id` - 删除菜单项

### 订单 API
- `GET /api/v1/orders` - 获取所有订单
- `GET /api/v1/orders/:id` - 获取单个订单
- `POST /api/v1/orders` - 创建订单
- `PUT /api/v1/orders/:id` - 更新订单
- `DELETE /api/v1/orders/:id` - 删除订单

## 数据库迁移

项目启动时会自动执行数据库迁移，创建所需的表结构。

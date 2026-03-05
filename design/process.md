遇到问题  
1q访问其他路由 404
解决问题：
devServer: {
historyApiFallback: true,
port: 8080,
},

2q访问其他路由为跟路由
跟路由的key 不能是空 需要是 '/'


3q go调试热更新
go install github.com/cosmtrek/air@latest
air -v
# 1. 进入你的项目目录
cd your-go-project

# 2. 生成配置文件 .air.toml
air init
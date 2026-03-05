遇到问题  
1q访问其他路由 404
解决问题：
devServer: {
historyApiFallback: true,
port: 8080,
},

2q访问其他路由为跟路由
跟路由的key 不能是空 需要是 '/'

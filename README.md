[从零开始使用webpack构建react + ts前端项目 - 简书 (jianshu.com)](https://www.jianshu.com/p/51f8ba9704b1)

### 1.1创建文件夹

右键-新建-文件夹 重命名为react-ts-project
 创建好后双击进入该文件夹

或者  命令行执行
 `mkdir react-ts-project`
 `cd react-ts-project`



### 1.2项目初始化

执行`npm init -y`初始化



打开package.json，在script里增加



```
{
  "name": "react-ts-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --open --mode development",
    "build": "webpack --mode production",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```

## 依赖安装

`yarn  add webpack webpack-cli webpack-dev-server react react-dom typescript esbuild-loader html-loader html-webpack-plugin`
 安装本项目所需依

## 3.编写webpack.config.js

```
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");


module.exports = {
    entry: "./src/main.tsx", //入口文件
    output: {  //输出路径和文件名
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.html$/, //使用html-loader
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.(js|ts|jsx|tsx)$/, //使用esbuild-loader将js、ts、jsx、tsx文件内容转换为es2015
                include: path.appSrc,
                use: [
                    {
                        loader: "esbuild-loader",
                        options: {
                            loader: "tsx",
                            target: "es2015",
                        },
                    }
                ]
            }
        ]
    },
    plugins: [ //使用插件，这里使用了HtmlWebPackPlugin
        new HtmlWebPackPlugin({
            title: "react-ts-project",
            filename: "./index.html",
            template: "./public/index.html"
        })
    ]
};
```

## 4.编写tsconfig.json

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    // "suppressImplicitAnyIndexErrors": true,
    "outDir": "./build",
    "sourceMap": false,
    "allowJs": true, // allowJs=true => tsc compile js as module, no type check
    "removeComments": true,
    "noImplicitReturns": true,
    "noEmit": true,
    "noImplicitAny": false,
    "noImplicitThis": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "declaration": true,
    "downlevelIteration": true,
    "allowImportingTsExtensions": true,
    "lib": [
      "dom",
      "esnext",
      "DOM.Iterable"
    ],
    "baseUrl": "./",
    "paths": {
      "@api/*": [
        "./src/api"
      ],
      "@src/*": [
        "./src/*"
      ],
      "@components/*": [
        "./src/components/*"
      ],
      "@utils/*": [
        "./src/utils/*"
      ],
      "@styles": [
        "./src/styles"
      ]
    }
  },
  "include": [
    "src",
  ],
  "exclude": [
    "node_modules",
    "webpack",
    "build",
  ]
}

```



## 5.编写项目

首先在根目录下新建src文件夹、public文件夹，在public文件夹内新建index.html文件，文件内容如下



```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>react-ts-project</title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

在src文件下新建main.tsx文件，文件内容如下

```
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";


ReactDOM.render(
  <App />,
  document.getElementById("app")
);
```

新建app.tsx文件，文件内容如下

```
import React, { useState } from "react";

function App() {

  return (
    <div>hello react + ts</div>
  );
}

export default App;

```





添加css loader

```
yarn  add style-loader
npm install  css-loader less-loader less
```

webpack.js中添加

```
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
  // ...
};
```

webpack添加

```

  resolve: {
    extensions: [".js", ".jsx", "ts", "tsx"], // 自动解析这些扩展名
  },
```





添加urlloader

```
yarn  add url-loader

{
    test: /\.(png|jpg|gif|svg)$/,
    loader: "url-loader",
    options: {
        limit:1024000,
        name: "[name].[ext]?[hash]"
    }
}
```



添加svg 解析

```
 npm  i @svgr/webpack
  
```



package.json 添加

```
   "@arco-design/web-react": "2.61.0",
    "@arco-themes/react-ocean-design": "^0.0.56",
    "@ccf2e/arco-material": "^1.2.1",
    "axios": "^0.24.0",
    "dayjs": "^1.11.7",
    
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "react-router": "5.2.0",
    "react-router-dom": "5.2.0",
```


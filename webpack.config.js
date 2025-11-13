const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  let publicPath;
  if (argv.mode === 'development') {
    publicPath = '/';
  } else if (argv.mode === 'production') {
    publicPath = './webfile/react/';
    // publicPath = '/beijing/webfile/react/';
  }
  return {
    entry: './src/main.tsx', //入口文件
    output: {
      //输出路径和文件名
      publicPath: publicPath,
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      alias: {
        '@images': path.resolve(__dirname, 'src/images'),
      },
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },

        {
          test: /\.html$/, //使用html-loader
          use: [
            {
              loader: 'html-loader',
            },
          ],
        },
        {
          test: /\.(js|ts|jsx|tsx)$/, //使用esbuild-loader将js、ts、jsx、tsx文件内容转换为es2015
          include: path.appSrc,
          use: [
            {
              loader: 'esbuild-loader',
              options: {
                loader: 'tsx',
                target: 'es2015',
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|gif)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 3000,
            },
          },
        },

        // {
        //   test: /\.(png|jpg|gif)$/,
        //   use: [
        //     {
        //       loader: 'file-loader',
        //       options: {
        //         name: 'images/[name].[ext]'

        //       },
        //     },
        //   ],
        // },

        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: true,
                importLoaders: 1,
              },
            },
          ],
        },

        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', 'less-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // 自动解析这些扩展名
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      //使用插件，这里使用了HtmlWebPackPlugin
      new HtmlWebPackPlugin({
        title: 'react-ts-project',
        filename: './index.html',
        template: './public/index.html',
      }),
    ],
  };
};

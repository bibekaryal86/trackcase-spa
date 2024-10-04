const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')

module.exports = (env) => {
  return {
    mode: 'development',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '/',
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext][query]',
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@app': path.resolve(__dirname, 'src/app/'),
        '@calendars': path.resolve(__dirname, 'src/calendars/'),
        '@cases': path.resolve(__dirname, 'src/cases/'),
        '@clients': path.resolve(__dirname, 'src/clients/'),
        '@collections': path.resolve(__dirname, 'src/collections/'),
        '@constants': path.resolve(__dirname, 'src/constants/'),
        '@courts': path.resolve(__dirname, 'src/courts/'),
        '@filings': path.resolve(__dirname, 'src/filings/'),
        '@home': path.resolve(__dirname, 'src/home/'),
        '@judges': path.resolve(__dirname, 'src/judges/'),
        '@ref_types': path.resolve(__dirname, 'src/types/'),
        '@users': path.resolve(__dirname, 'src/users/'),
      },
    },
    devtool: 'cheap-module-source-map',
    target: 'web',
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'build'),
      },
      historyApiFallback: true,
      port: 9191,
      open: false,
      hot: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        favicon: 'public/favicon.ico',
        historyApiFallback: 'public/index/html',
      }),
      //new webpack.HotModuleReplacementPlugin(),
      // new ForkTsCheckerWebpackPlugin({
      //   async: false,
      //   typescript: {
      //     diagnosticOptions: {
      //       semantic: true,
      //       syntactic: true,
      //     },
      //     mode: 'write-references',
      //   },
      // }),
      new ESLintPlugin({
        configType: 'flat',
        extensions: ['js', 'ts', 'tsx'],
        failOnWarning: false,
        failOnError: false,
      }),
      new DotenvPlugin({
        path: './variables.env',
      }),
      new webpack.EnvironmentPlugin({
        BASE_URL: env.base_url || 'http://localhost:9090',
      }),
    ],
  }
}

const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = (env) => {
  return {
    mode: 'production',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      publicPath: '',
      filename: '[name].[contenthash].js',
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
    devtool: 'source-map',
    target: 'web',
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        favicon: 'public/favicon.ico',
        historyApiFallback: 'public/index/html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new ForkTsCheckerWebpackPlugin({
        async: false,
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
          mode: 'write-references',
        },
      }),
      new ESLintPlugin({
        configType: 'flat',
        extensions: ['js', 'ts', 'tsx'],
        failOnWarning: true,
        failOnError: true,
      }),
      new CleanWebpackPlugin(),
      new DotenvPlugin({
        path: './variables.env',
      }),
      new webpack.EnvironmentPlugin({
        BASE_URL: env.base_url || 'https://authenv-service.appspot.com/',
      }),
    ],
  }
}

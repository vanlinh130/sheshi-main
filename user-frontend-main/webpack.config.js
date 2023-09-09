/* eslint-disable  */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

function getAppConfig(env, iframe) {
  let data = require(`./src/configs/${env}`)
  const defaultData = require('./src/configs/default')

  data = {
    ...defaultData,
    ...data
  }

  return {
    ...data,
    PUBLIC_PATH: iframe ? data.PUBLIC_PATH : '',
    ENV: env
  }
}

module.exports = (env) => {
  console.log(env)
  const NODE_ENV = (env && env.NODE_ENV) || 'development'
  const IS_DEV = NODE_ENV === 'local'
  const appConfigs = getAppConfig(NODE_ENV, env.IFRAME)

  process.env.NODE_ENV = NODE_ENV

  console.log('Node ENV: %s', NODE_ENV)

  return {
    devtool: IS_DEV ? 'eval-cheap-module-source-map' : false,
    entry: path.resolve(__dirname, 'src'),
    output: {
      filename: '[name][hash].js',
      chunkFilename: '[name][hash].js',
      path: path.resolve(__dirname, 'build'),
      publicPath: appConfigs.PUBLIC_PATH
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin(),
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [{
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      }, {
        test: /\.(jpg|jpeg|png|svg|woff|eot|ttf|otf|pdf|gif)$/,
        type: 'asset/resource'
      }, {
        test: /\.(mov|mp4)$/,
        type: 'asset/resource'
      }, {
        test: /\.scss$/,
        use: [
          IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      }, {
        test: /\.css$/,
        use: [
          IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }, {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: !IS_DEV,
            root: path.resolve(__dirname, 'src')
          }
        }]
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: appConfigs.TITLE,
        template: path.resolve(__dirname, 'src/index.ejs'),
        favicon: path.resolve(__dirname, 'public/favicon.png'),
        templateParameters: {
          language: appConfigs.PAGE_LANGUAGE
        }
      }),
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new MiniCssExtractPlugin({
        filename: '[name][hash].css'
      }),
      new webpack.DefinePlugin({
        'window._CONFIG': JSON.stringify(appConfigs)
      }),
      new CopyPlugin({
        patterns: [{
          from: path.join(__dirname, 'public'),
          to: path.join(__dirname, 'build')
        }]
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      open: true,
      historyApiFallback: true
    },
    stats: 'minimal',
    mode: IS_DEV ? 'development' : 'production'
  }
}

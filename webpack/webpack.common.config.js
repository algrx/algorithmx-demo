const webpack = require('webpack')
const ConcatPlugin = require('webpack-concat-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const common = require('./common')
const brythonVersion = require('../brython/version.json').version

const config = {
  entry: {
    index: ['./src/index.tsx']
  },
  output: {
    path: common.outputPath,
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'sass-loader' }
          ]
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /examples.*\.(py|js)$/,
        use: [{ loader: 'raw-loader' }],
        exclude: /node_modules/
      },
      {
        test: /brython.*\.js$/,
        use: [{ loader: 'raw-loader' }],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ExtendedAPIPlugin(),
    new ExtractTextPlugin('[name].[hash].css'),
    new CleanWebpackPlugin(),
    new ConcatPlugin({
        name: 'brython',
        fileName: `[name].${brythonVersion}.js`,
        filesToConcat: ['./brython/_dist/brython.js', './brython/_dist/brython_modules.js'],
        injectType: 'none'
    }),
    new HtmlPlugin({
      filename: 'index.html',
      template: common.template,
      inject: true,
      excludeChunks: ['brython_modules']
    })
  ]
}

module.exports = config

const common = require('./common')
const webpack = require('webpack')

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: common.outputPath,
    compress: true,
    hot: false,
    port: 9000
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = config

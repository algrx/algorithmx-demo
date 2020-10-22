const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack/webpack.common.config');

module.exports = (env) => {
    const envConfig = require(`./webpack/webpack.${env.env}.config`);
    return webpackMerge(commonConfig, envConfig);
};

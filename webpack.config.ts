import * as path from 'path';
import * as webpack from 'webpack';
import MergeIntoSingleFilePlugin from 'webpack-merge-and-include-globally';
import webpackMerge from 'webpack-merge';
import HtmlPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const outputPath = path.resolve(__dirname, 'dist');
const brythonVersion = require('./brython/version.json').version;

const commonConfig: webpack.Configuration = {
    entry: {
        index: ['./src/index.tsx'],
    },
    output: {
        path: outputPath,
        filename: '[name].[contenthash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]',
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /examples.*\.(py|js)$/,
                use: [{ loader: 'raw-loader' }],
                exclude: /node_modules/,
            },
            {
                test: /brython.*\.js$/,
                use: [{ loader: 'raw-loader' }],
                exclude: /node_modules/,
            },
        ],
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
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        new webpack.ProgressPlugin({}),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
        }) as webpack.WebpackPluginInstance,
        new HtmlPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: true,
            excludeChunks: ['brython_modules'],
        }),
    ],
};

const brythonConfig: webpack.Configuration = {
    entry: {},
    output: {
        path: outputPath,
    },
    plugins: [
        new MergeIntoSingleFilePlugin({
            files: {
                [`brython.${brythonVersion}.js`]: [
                    './brython/dist/brython.js',
                    './brython/dist/brython_modules.js',
                ],
            },
        }) as webpack.WebpackPluginInstance,
    ],
    performance: {
        maxEntrypointSize: 3500 * 1000,
        maxAssetSize: 3500 * 1000,
    },
};

const prodConfig: webpack.Configuration = {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': "'production'",
        }),
    ],
};

const devConfig: webpack.Configuration = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: outputPath,
        compress: true,
        hot: false,
        port: 9000,
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
};

module.exports = (env: {}, argv: webpack.Configuration) => {
    const config = argv.mode === 'production' ? prodConfig : devConfig;
    return [brythonConfig, webpackMerge(commonConfig, config)];
};

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const commonPlugin = require('./common');

const plugins = [
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
    }),
    commonPlugin.HtmlWebpackPlugin()
];

module.exports = plugins;

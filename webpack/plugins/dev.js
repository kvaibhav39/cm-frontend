const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const commonPlugin = require('./common');

const plugins = [
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
    }),
    commonPlugin.HtmlWebpackPlugin()
];

module.exports = plugins;

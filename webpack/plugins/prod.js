const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const commonPlugin = require('./common');
const webpack = require("webpack");

const plugins = [
    new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
    }),
    commonPlugin.HtmlWebpackPlugin(),
    new webpack.DefinePlugin({
        'process.env': {
            'REACT_APP_IP_ADDRESS': JSON.stringify(process.env.REACT_APP_IP_ADDRESS)
        }
    })
];

module.exports = plugins;

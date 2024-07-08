const OptimizeCSSAssetsPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpackMerge = require("webpack-merge").merge;
const path = require("path");

const commonConfig = require("./webpack.common");
const plugins = require("./plugins/prod");

module.exports = webpackMerge(commonConfig, {
    mode: "production",
    devtool: "source-map",
    plugins: plugins,
    optimization: {
        minimize: true,
        minimizer: [
            new OptimizeCSSAssetsPlugin({}),
            new TerserPlugin({
                parallel: true
            })
        ],
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        assetModuleFilename: "assets/images/[name].[contenthash].[ext]",
        publicPath: "/",
        filename: "assets/[name].[contenthash].js",
        chunkFilename: "assets/[id].[contenthash].chunk.js"
    },
});

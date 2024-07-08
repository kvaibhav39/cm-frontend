const webpackMerge = require("webpack-merge").merge;
const path = require("path");

const commonConfig = require("./webpack.common");
const plugins = require("./plugins/prod");

module.exports = webpackMerge(commonConfig, {
    target: "web",
    mode: "development",
    devtool: "inline-source-map",
    plugins: plugins,
    output: {
        path: path.resolve(__dirname, "../dist"),
        assetModuleFilename: "assets/images/[name].[contenthash].[ext]",
        publicPath: "/",
        filename: "[name].js",
        chunkFilename: "[id].chunk.js"
    },
    performance: {
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith(".js");
        }
    },
    devServer: {
        historyApiFallback: true,
        hot: true
    }
});

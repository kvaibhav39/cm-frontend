const commonPlugin = require('./plugins/common');
const loaderRules = require('./loaders/common');

module.exports = {
    entry: {
        main: './src/index.js',
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".scss", ".html"],
        modules: ["src", "node_modules"] // Assuming that your files are inside the src dir
    },
    stats: "minimal",
    module: {
        rules: loaderRules
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 1
                }
            }
        }
    },
    watchOptions: {
        aggregateTimeout: 10000,
        poll: 5000
    },
    plugins: [
        commonPlugin.CleanWebpackPlugin(),
        commonPlugin.CopyWebpackPlugin(),
        //commonPlugin.DotEnvWebpackPlugin()
    ]
};

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const loaderRules = [
    {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
            loader: "babel-loader"
        }
    },
    {
        test: /(\.scss|\.css)$/,
        use: [
            MiniCssExtractPlugin.loader,
            {loader: 'css-loader', options: {importLoaders: 13}},
            {

                loader: "postcss-loader", options: {
                    postcssOptions: {
                        plugins: ["autoprefixer"]
                    }
                }
            }, "sass-loader"
        ]
    },
    {
        test: /\.(woff|woff2|ttflotfleot|ico)(\?.*$|$)/,
        type: 'asset/resource'
    },
    {
        test: /\.(png|jp(e*)g|svg)$/,
        type: 'asset/inline'
    }
];

module.exports = loaderRules;

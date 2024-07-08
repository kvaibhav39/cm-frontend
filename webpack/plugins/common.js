const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const path = require("path");

const htmlWebpackPlugin = () => new HtmlWebpackPlugin({
    // template: ' ./src/index.html'
    // template: path.join(__dirname, "src", "index.html")
    template: path.join(__dirname, "../../public", "index.html")
});

const cleanWebpackPlugin = () => new CleanWebpackPlugin();

const dotEnvWebpackPlugin = () => new Dotenv();

const copyWebpackPlugin = () => new CopyWebpackPlugin({
    patterns: [{
        from: './src/assets',
        to: './assets',
        force: true
    }]
});

module.exports = {
    HtmlWebpackPlugin: htmlWebpackPlugin,
    CleanWebpackPlugin: cleanWebpackPlugin,
    CopyWebpackPlugin: copyWebpackPlugin,
    DotEnvWebpackPlugin: dotEnvWebpackPlugin
};
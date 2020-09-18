const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [
        './src/js/index.js'
    ],
    output: {
        path: path.resolve(__dirname, 'dist'), // use node module path to resolve the __dirname == current path to an absolute path and combine it with dist/js
        filename: 'js/bundle.js'
    },
    plugins: [
        // Use src file and copy to dist folder
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html"     
        })
    ],
    module: {
        // Required for babel
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    // Dev server does *not* create the files on disk
    // It only streams then and creates on the fly. It does
    // the same as a dev build, but without touching files
    devServer: {
        contentBase: './dist' // needs to point to the output path - otherwise it wont work
    }
};
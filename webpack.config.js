const path = require('path');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'), // use node module path to resolve the __dirname == current path to an absolute path and combine it with dist/js
        filename: 'bundle.js'
    },
    mode: 'development' // as fast as possible, no compression
};
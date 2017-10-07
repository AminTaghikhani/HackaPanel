module.exports = {
    devtool: 'inline-source-map',
    entry: './client/index.js',
    watch: true,
    output: {
        filename: './public/javascripts/bundle.js',
        sourceMapFilename: './public/javascripts/bundle.js.map'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader',
            query: { presets: ['es2015', 'react'] }
        }, {
            test: /\.sass$/,
            use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "sass-loader" }]
        }]
    }
};

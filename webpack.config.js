const webpack = require('webpack');
const BabiliPlugin = require("babili-webpack-plugin");
const pkg = require('./package.json');
const isProd = process.env.NODE_ENV === 'production';

const banner = `
  ${pkg.name} - ${pkg.description}
  Author: ${pkg.author}
  Version: v${pkg.version}
  URL: ${pkg.homepage}
  License: ${pkg.license}
`;

let plugins = [];

if(isProd) {
  plugins.push(new BabiliPlugin());
}

plugins.push(new webpack.BannerPlugin({
  banner
}));

module.exports = {
  entry: {
    TypeIt: './src/typeit.js'
  },
  output: {
    path: __dirname + '/dist',
    library: 'TypeIt',
    libraryTarget: 'umd',
    filename: isProd ? 'typeit.min.js' : 'typeit.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          compact: false
        }
      }
    ]
  },
  plugins: plugins
};

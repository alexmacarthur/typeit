const webpack = require("webpack");
const pkg = require("./package.json");
const merge = require("webpack-merge");

const banner = `
TypeIt - ${pkg.description}
Author: ${pkg.author}
Version: v${pkg.version}
License: ${pkg.license}
URL: ${pkg.homepage}
`;

const browsers = {
  default: ["> 2%", "Last 2 versions", "safari >=9", "not ie < 11"],
  modern: [
    "Edge >= 16",
    "Firefox >= 60",
    "Chrome >= 61",
    "Safari >= 11",
    "Opera >= 48"
  ]
};

const getJSRule = type => {
  return {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        cacheDirectory: true,
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: browsers[type]
              }
            }
          ]
        ]
      }
    }
  };
};

const baseConfiguration = {
  mode: process.env.NODE_ENV,
  entry: {
    TypeIt: "./src/TypeIt.js"
  },
  output: {
    path: __dirname + "/dist",
    library: "TypeIt",
    libraryTarget: "umd",
    libraryExport: "default",
    filename: "typeit.min.js",
    globalObject: "this"
  },
  module: {
    rules: [getJSRule("default")]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner
    })
  ]
};

const modernConfiguration = merge.smart(baseConfiguration, {
  output: {
    filename: "typeit.modern.min.js"
  },
  module: {
    rules: [getJSRule("modern")]
  }
});

const output = [baseConfiguration];

if (process.env.NODE_ENV === "production") {
  output.push(modernConfiguration);
}

module.exports = output;

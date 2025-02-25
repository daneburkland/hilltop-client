const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const PAGES_PATH = "./src/pages";

function generateHtmlPlugins(items) {
  return items.map(
    name =>
      new HtmlPlugin({
        filename: `./${name}.html`,
        chunks: [name]
      })
  );
}

module.exports = {
  entry: {
    background: [`${PAGES_PATH}/background`],
    hilltop: [`${PAGES_PATH}/hilltop`],
    popup: [`${PAGES_PATH}/popup`],
    index: [`${PAGES_PATH}/content`]
  },
  output: {
    path: path.resolve("dist/pages"),
    filename: "[name].js"
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        include: [path.resolve(PAGES_PATH), path.resolve("../shared")]
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ttf$|\.eot$|\.svg$/,
        use: "file-loader?name=[name].[ext]?[hash]"
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/fontwoff"
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "[name].[contenthash].css"
    }),
    new CopyPlugin([
      {
        from: "src",
        to: path.resolve("dist"),
        ignore: ["pages/**/*"]
      }
    ]),
    ...generateHtmlPlugins(["background", "hilltop", "popup"])
  ]
};

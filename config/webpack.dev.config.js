const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, '../docs'),
    filename: '[name]-bundle.js',
  },
  mode: 'development',
  devServer: {
    open: true,
    contentBase: '../docs',
    overlay: true,
    hot: true,
    stats: {
      colors: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        use: { loader: 'babel-loader' },
        exclude: /node_modules/,
      },
      // {
      //   test: /\.html$/,
      //   use: { loader: 'file-loader' },
      // },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  // devTool: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};

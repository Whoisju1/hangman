const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'docs'),
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                indent: 'postcss',
                plugins: () => [
                  autoprefixer({
                    browsers: [
                      '> 1%',
                      'last 2 versions',
                    ],
                  }),
                ],
              },
            },
            {
              loader: 'sass-loader',
              options: {
                importLoaders: 2,
              },
            },
          ],
        }),
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
    }),
    new ExtractTextPlugin('style.css'),
  ],
  devtool: 'cheap-module-eval-source-map',
};

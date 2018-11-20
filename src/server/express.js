import express from 'express';
import webpack from 'webpack';
import path from 'path';
import config from '../../config/webpack.dev.config';

const compiler = webpack(config);
const webpackDevMiddleware = require('webpack-dev-middleware')(
  compiler,
  config.devServer,
);
const webpackHotMiddleware = require('webpack-hot-middleware')(compiler);

const server = express();

const staticMiddleware = express.static(path.resolve(__dirname, 'docs'));

server.use(webpackDevMiddleware);
server.use(webpackHotMiddleware);
server.use(staticMiddleware);

const { PORT = 5000 } = process.env;

server.listen(PORT, () => `Server ready on http://localhost:${PORT}`);

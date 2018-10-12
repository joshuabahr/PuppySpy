/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const dotenv = require('dotenv');

module.exports = () => {
  const env = dotenv.config().parsed;

  const envKeys = Object.keys(env).reduce(
    (prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    },
    { 'process.env.NODE_ENV': JSON.stringify('production') }
  );

  return {
    mode: 'production',
    context: __dirname,
    entry: ['./frontend/ClientApp.jsx', 'webrtc-adapter'],
    devtool: 'source-map',
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'bundle.js'
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx', '.json'],
      modules: [path.resolve(__dirname, 'node_modules')]
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.HashedModuleIdsPlugin(),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.(js|css)$/,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: true
      })
    ],
    optimization: {
      minimizer: [new UglifyJsPlugin()]
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
        }
      ]
    }
  };
};

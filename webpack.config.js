const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './handler.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'build'),
    filename: 'handler.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
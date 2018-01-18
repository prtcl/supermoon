const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './app/app.js',
  output: {
    path: path.resolve('static', 'dist'),
    publicPath: '/dist/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loaders: 'babel-loader',
        include: path.resolve('app')
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'less-loader' }
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' }
          ]
        })
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('main.css')
  ]
};

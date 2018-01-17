const path = require('path');

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
      }
    ]
  }
};

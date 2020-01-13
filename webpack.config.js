const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    calculator: path.resolve(__dirname, './index.js')
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: '[name].min.js',
    library: 'precise-calculator',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      loader: 'babel-loader',
      exclude: /(node_modules|bower_components)/
    }
    ]
  }
}
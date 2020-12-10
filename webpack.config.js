const { resolve } = require('path')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    app: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'dist'),
  },
}

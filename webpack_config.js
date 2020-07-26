const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const [entryFile, outputFile] = process.env.TARGET === 'example' ?
  ['example.js', 'eventsheet-example.js'] :
  ['src', 'eventsheet.js']

module.exports = {
  mode: 'none',
  devtool: 'sourcemap',
  entry: [
    path.resolve(__dirname, entryFile)
  ],
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: outputFile,
    library: 'EventSheet'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          'babel-loader',
          'eslint-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
    ]
  },
  resolve: {
    alias: {
      '~/cargos/wasm-css': path.resolve(__dirname, 'cargos/wasm-css/pkg/wasm_css.js'),
    },
  },
  externals: [nodeExternals()],
}

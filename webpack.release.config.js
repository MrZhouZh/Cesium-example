const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopywebpackPlugin = require('copy-webpack-plugin')

const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    publicPath: '/',
    // Needed to compile multiline strings in Cesium
    sourcePrefix: ''
  },
  resolve: {
    mainFields: ['module', 'main']
  },
  amd: {
    // Enable webpack-friendly use of require in Cesium
    toUrlUndefined: true
  },
  node: {
    // Resolve node module use of fs
    fs: 'empty',
    Buffer: false,
    http: 'empty',
    https: 'empty',
    zlib: 'empty'
  },
  devServer: {
    contentBase: path.join(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader']
      },
      {
        // remove pragmas
        test: /\.js$/,
        enforce: 'pre',
        include: path.join(__dirname, 'node_modules/cesium/Source'),
        sideEffects: false,
        use: [{
          loader: 'strip-pragma-loader',
          options: {
            pragmas: {
              debug: false
            }
          }
        }]
      }
    ]
  },
  optimization: {
    usedExports: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopywebpackPlugin([
      {
        from: path.join(cesiumSource, cesiumWorkers),
        to: 'Workers'
      }
    ]),
    new CopywebpackPlugin([
      {
        from: path.join(cesiumSource, 'Assets'),
        to: 'Assets'
      }
    ]),
    new CopywebpackPlugin([
      {
        from: path.join(cesiumSource, 'Widgets'),
        to: 'Widgets'
      }
    ]),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('')
    })
  ]
}

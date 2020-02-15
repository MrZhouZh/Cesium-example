const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'development',
  context: __dirname,
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // resolve: {
  //   alias: {
  //     // CesiumJS module name
  //     cesium: path.resolve(__dirname, cesiumSource)
  //   }
  // },
  devtool: 'eval',
  // amd: {
  //   // Enable webpack-friendly use of require in Cesium
  //   toUrlUndefined: true
  // },
  node: {
    // Resolve node module use of fs
    fs: 'empty',
    Buffer: false,
    http: "empty",
    https: "empty",
    zlib: "empty"
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
          // {
          //   loader: 'css-loader',
          //   options: {
          //     // minify loaded css
          //     minimize: true
          //   }
          // }
        ]
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader']
      },
      {
        test: /\.worker\.js$/,
        include: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Workers'),
        use: ['worker-loader']
      }
      // {
      //   // Strip cesium pragmas
      //   test: /\.js$/,
      //   enforce: 'pre',
      //   include: path.resolve(__dirname, cesiumSource),
      //   use: [{
      //       loader: 'strip-pragma-loader',
      //       options: {
      //           pragmas: {
      //             debug: false
      //           }
      //       }
      //   }]
      // }
    ]
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
    splitChunks: {
      chunks(module) {
        return module.context && module.context.indexOf('cesium') !== -1
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    // Copy Cesium Assets, Widgets, and Workers to a static directory
    new CopyWebpackPlugin([
      {
        from: 'node_modules/cesium/Build/Cesium/Workers',
        to: 'Workers'
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/cesium/Build/Cesium/ThirdParty',
        to: 'ThirdParty'
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/cesium/Build/cesium/Assets',
        to: 'Assets'
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/cesium/Build/cesium/Widgets',
        to: 'Widgets'
      }
    ]),
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('')
    })
  ]
}

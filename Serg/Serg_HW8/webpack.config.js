const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ENTRY_PATH = path.resolve(__dirname, 'src');
const OUTPUT_PATH = path.resolve(__dirname, 'dist');

module.exports = {
  entry: ['babel-polyfill', path.resolve(ENTRY_PATH, 'index.js')],
  devServer: {
    port: 8080,
    contentBase: OUTPUT_PATH,
    open: true,
    overlay: true,
    historyApiFallback: true,
    // proxy: {
    //   '/': 'http://localhost:3000'
    // }
  },
  output: {
    path: OUTPUT_PATH,
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2'],
          },
        },
      },
      {
        test: /\.sass$/,
        use: ExtractTextPlugin.extract(
            {
              fallback: 'style-loader',
              use: ['css-loader', 'postcss-loader', 'sass-loader'],
            }),
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 90,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '98',
                speed: 1,
              },
              giflossy: {
                optimizationLevel: 3,
                optimize: 3,
                lossy: 2,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin(
        {filename: 'style.[chunkhash].css', allChunks: true},
    ),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: path.resolve(ENTRY_PATH, 'index.html'),
      filename: 'index.html',
    }),
    new CleanWebpackPlugin([OUTPUT_PATH]),
  ],
};
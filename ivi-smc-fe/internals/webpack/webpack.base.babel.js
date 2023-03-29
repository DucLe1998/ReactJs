/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const BUILD_FOLDER_PATH = process.env.BUILD_FOLDER_PATH || 'build';
const PUBLIC_PATH = process.env.SMC_DEFAULT_PATH || '/';
const API_HOST = process.env.API_HOST || 'https://dev-ivi.basesystem.one';
const API_VERSION = process.env.API_VERSION || 'v0';
const SUB_PATH = process.env.SUB_PATH || 'tnp';
module.exports = (options) => ({
  mode: options.mode,
  entry: options.entry,
  output: {
    // Compile into js/build.js
    path: path.resolve(process.cwd(), BUILD_FOLDER_PATH),
    publicPath: PUBLIC_PATH,
    ...options.output,
  }, // Merge with env dependent settings
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: [/node_modules/, /app[\\/]vendor/],
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true,
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        },
      },
    ],
  },
  plugins: options.plugins.concat([
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; Terser will automatically
    // drop any unreachable code.
    // new CopyPlugin([
    //   {
    //     from: 'app/vendor/tinymce',
    //     to: 'vendor/tinymce',
    //   },
    // ]),
    // new webpack.EnvironmentPlugin({
    //   NODE_ENV: 'development',
    // }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        DATE_TIME_FORMAT: JSON.stringify('DD/MM/YY HH:mm'),
        FORMAT_DATE: JSON.stringify('yyyy-MM-dd'),
        SMC_DEFAULT_PATH: JSON.stringify(''),
        API_HOST: JSON.stringify(API_HOST),
        SAP_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/sap/api/${API_VERSION}`,
        ),
        IAM_API_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/iam/api/${API_VERSION}`,
        ),
        CMS_API_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/cms/api/${API_VERSION}`,
        ),
        INTERCOM_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/intercom/api/${API_VERSION}`,
        ),
        ACCESS_CONTROL_API_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/access-control/api/${API_VERSION}`,
        ),
        STORAGE_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/storage/api/${API_VERSION}`,
        ),
        CAMERA_AI_API_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/cameraai/api/${API_VERSION}`,
        ),
        GUEST_REGISTRATION: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/guest/api/${API_VERSION}`,
        ),
        PARKING_API_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/smart-parking/api/${API_VERSION}`,
        ),
        NOTIFICATION_EVENT_API_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/notification/api/${API_VERSION}`,
        ),
        SOCKET_HOST: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/notification/api/v0/websocket`,
        ),
        AREA_ID: JSON.stringify('1001'),
        ZONE_ID: JSON.stringify('10001'),
        BLOCK_ID: JSON.stringify('10003'),
        AREA_NAME: JSON.stringify('Technopark'),
        ARTICLES_SRC: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/app-be/api/${API_VERSION}`,
        ),
        FIRE_ALARM: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/fire-alarm/api/${API_VERSION}`,
        ),
        NAVIGATION: JSON.stringify(
          `${API_HOST}/${SUB_PATH}/navigation/api/${API_VERSION}`,
        ),
      },
    }),
    new webpack.ContextReplacementPlugin(
      /\.\/locale$/,
      'empty-module',
      false,
      /js$/,
    ),
  ]),
  resolve: {
    modules: ['node_modules', 'app'],
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      globalize$: path.resolve(
        __dirname,
        'node_modules/globalize/dist/globalize.js',
      ),
      globalize: path.resolve(
        __dirname,
        'node_modules/globalize/dist/globalize',
      ),
      cldr$: path.resolve(__dirname, 'node_modules/cldrjs/dist/cldr.js'),
      cldr: path.resolve(__dirname, 'node_modules/cldrjs/dist/cldr'),
    },
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});

/**
 * Webpack helpers & dependencies
 */
let settings = require('./build-config');
const $$ = require('./webpack-helpers'),
  commonConfig = require('./webpack.common.js'),
  webpackMerge = require('webpack-merge'),
  webpackMergeDll = webpackMerge.strategy({plugins: 'replace'});

settings = $$.loadSettings(settings);

const dllBundlesPlugin = require('webpack-dll-bundles-plugin').DllBundlesPlugin,
  commonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
  addAssetHtmlPlugin = require('add-asset-html-webpack-plugin'),
  loaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 4200;

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
const defaultConfig = {
  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  devtool: settings.webpack.devtool.DEV,

  /**
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    /**
     * Plugin LoaderOptionsPlugin (experimental)
     *
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7
     */
    new loaderOptionsPlugin({
      debug: true
    })
  ],
  output: {
    publicPath: ''
  },
};

const browserConfig = {
  /**
   * The entry point for the bundle
   * Our Angular app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: {
    'twbs': 'bootstrap-loader/extractStyles',
    'polyfills': $$.root(`${settings.paths.src.client.root}/polyfills.ts`),
    'app': $$.root(`${settings.paths.src.client.root}/main-spa.ts`)
  },

  /**
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: true,
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  },

  /**
   * Options affecting the output of the compilation.
   *
   * See: http://webpack.github.io/docs/configuration.html#output
   */
  output: {
    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: $$.root(settings.paths.public.client),

    /**
     * Specifies the name of each output file on disk.
     * IMPORTANT: You must not specify an absolute path here!
     *
     * See: http://webpack.github.io/docs/configuration.html#output-filename
     */
    filename: '[name].bundle.js',

    /**
     * The filename of the SourceMaps for the JavaScript files.
     * They are inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
     */
    sourceMapFilename: '[name].map',

    /** The filename of non-entry chunks as relative path
     * inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
     */
    chunkFilename: '[id].chunk.js',

    libraryTarget: 'var',
    library: 'kr_[name]'
  },

  /**
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    /**
     * Plugin: DLLBundlesPlugin
     * Description: Bundles group of packages as DLLs
     *
     * See: https://github.com/shlomiassaf/webpack-dll-bundles-plugin
     */
    new dllBundlesPlugin({
      bundles: {
        polyfills: settings.webpack.bundles.polyfills,
        vendor: settings.webpack.bundles.angular.concat(settings.webpack.bundles.vendor)
      },
      dllDir: $$.root(`${settings.paths.temp.dll}`),
      webpackConfig: webpackMergeDll(commonConfig({env: ENV}),
        {
          devtool: settings.webpack.devtool.DEV,
          plugins: []
        })
    }),

    /**
     * Plugin: CommonsChunkPlugin
     * Description: Shares common code between the pages.
     * It identifies common modules and put them into a commons chunk.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
     * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
     */
    new commonsChunkPlugin({
      name: 'polyfills',
      chunks: ['polyfills']
    }),
    // This enables tree shaking of the vendor modules
    new commonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      minChunks: module => /node_modules/.test(module.resource)
    }),
    // Specify the correct order the scripts will be injected in
    new commonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),

    /**
     * Plugin: AddAssetHtmlPlugin
     * Description: Adds the given JS or CSS file to the files
     * Webpack knows about, and put it into the list of assets
     * html-webpack-plugin injects into the generated html.
     *
     * See: https://github.com/SimenB/add-asset-html-webpack-plugin
     */
    new addAssetHtmlPlugin([
      {filepath: $$.root(`${settings.paths.temp.dll}/${dllBundlesPlugin.resolveFile('polyfills')}`)},
      {filepath: $$.root(`${settings.paths.temp.dll}/${dllBundlesPlugin.resolveFile('vendor')}`)}
    ]),

    /**
     * Plugin LoaderOptionsPlugin (experimental)
     *
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7
     */
    new loaderOptionsPlugin({
      options: {
        context: $$.root()
      }
    })
  ],

  /**
   * Webpack Development Server configuration
   * Description: The webpack-dev-server is a little node.js Express server.
   * The server emits information about the compilation state to the client,
   * which reacts to those events.
   *
   * See: https://webpack.github.io/docs/webpack-dev-server.html
   */
  devServer: {
    port: PORT,
    host: HOST,
    historyApiFallback: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    proxy: {
      '/rest/**': {
        target: 'http://localhost:8080/'
      }
    }
  },
};

module.exports = function (options) {
  return webpackMerge(commonConfig({
    env: ENV,
    platform: 'browser'
  }), defaultConfig, browserConfig);
};

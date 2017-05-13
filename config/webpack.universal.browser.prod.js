/**
 * Webpack helpers & dependencies
 */
let settings = require('./build-config');
const $$ = require('./webpack-helpers'),
  prodConfig = require('./webpack.common.prod.js'),
  webpackMerge = require('webpack-merge');

settings = $$.loadSettings(settings);

const aotPlugin = require('@ngtools/webpack').AotPlugin;

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = webpackMerge(prodConfig({platform: 'browser'}), {
  /**
   * The entry point for the bundle
   * Our Angular app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: {
    'twbs': 'bootstrap-loader/extractStyles',
    'polyfills': $$.root(`${settings.paths.src.client.root}/polyfills.ts`),
    'app': $$.root(`${settings.paths.src.client.root}/main-browser.ts`)
  },

  output: {
    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: $$.root(settings.paths.public.client),
    publicPath: ''
  },

  /**
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  },
  /**
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    new aotPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: $$.root(`${settings.paths.src.client.app}/app.browser.module#AppBrowserModule`)
    })
  ],
});

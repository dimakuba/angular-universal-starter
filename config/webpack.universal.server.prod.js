/**
 * Webpack helpers & dependencies
 */
let settings = require('./build-config');
const prodConfig = require('./webpack.common.prod.js'),
  webpackMerge = require('webpack-merge'),
  $$ = require('./webpack-helpers');

settings = $$.loadSettings(settings);

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = webpackMerge(prodConfig({platform: 'server'}), {
  output: {
    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: $$.root(settings.paths.public.server)
  },
  
  /**
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: false,
    __dirname: false,
    __filename: false,
    process: false,
    Buffer: false
  },
});

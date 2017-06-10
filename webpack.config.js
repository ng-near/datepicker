var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin   = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const tsLoader = require('awesome-typescript-loader');

const { AotPlugin } = require('@ngtools/webpack');

var tsConfigPaths = require('./tsconfig').compilerOptions.paths;

function root(__path) {
  return path.join(__dirname, __path);
}

module.exports = function(env) {

  const prod = !env || !env.liveTest;

  // common config
  const config = {
    entry: {
      polyfills: './src/polyfills.ts',
      vendor: './src/vendor.ts'
    },

    resolve: {
      extensions: ['.ts', '.js', '.html', '.css'],
      modules: [
        root('node_modules/')
      ]
    },

    module: {
      rules: [
        {
          test: root('src/style.scss'),
          use: ExtractTextPlugin.extract([
            {
              loader: 'raw-loader',
            },
            {
              loader: 'sass-loader'
            }
          ])
        },
        {
          test: /\.scss$/,
          exclude: root('src/style.scss'),
          use: [
            {
              loader: 'raw-loader',
            },
            {
              loader: 'sass-loader'
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'raw-loader'
            },
            {
              loader: 'html-minifier-loader',
              options: {
                caseSensitive: true,
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                removeComments: true,
                quoteCharacter: '"',
                sortAttributes: true,
                sortClassName: true
              }
            }
          ]
        }
      ]
    },

    plugins: [
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        path.resolve(__dirname, '../src')
      ),

      new webpack.optimize.CommonsChunkPlugin({
        name: ['style', 'app', 'vendor', 'polyfills']
      }),

      new ExtractTextPlugin('style.css'),
    ],

    output: {
      path: root('dist'),
      filename: '[name].[hash].js'
    }
  };

  if (prod) {
    config.entry.app = './src/main-aot.ts';

    config.module.rules.push({
      test: /\.ts$/,
      use: "@ngtools/webpack"
    });

    config.plugins.push(
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        mangle: {
          screw_ie8: true,
          keep_fnames: true
        },
        compress: {
          screw_ie8: true,
          dead_code: true
        },
        comments: false
      }),
      new webpack.HashedModuleIdsPlugin(),

      new AotPlugin({
        tsConfigPath: 'tsconfig.json',
        entryModule: 'src/app/app.module#AppModule'
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: '../index.html'
      })
    );
  } else {
    config.entry.app = './src/main.ts';

    config.resolve.alias =  {
      // TODO path configurable ?
      'ng-imbadatepicker': root('../ng-imbadatepicker/src/')
    };

    config.module.rules.push({
      test: /\.ts$/,
      use:[
        { loader: 'awesome-typescript-loader', options: {
          compilerOptions: {
            baseUrl: '.',
            paths: {
              'ng-imbadatepicker': root('../ng-imbadatepicker/src/')
            }
          }
        }},
        { loader: 'angular2-template-loader' }
      ]
    });

    config.plugins.push(
      new tsLoader.CheckerPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
      })
    );

    config.devtool = 'source-map';

    config.devServer = {
      historyApiFallback: true,
      stats: 'minimal'
    };
  }

  return config;
};

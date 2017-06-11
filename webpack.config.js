var webpack = require('webpack');
var path    = require('path'); 
var ExtractPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = "127.0.0.1";
const PORT = "3001";

module.exports = {
    entry: [
        'babel-polyfill',
        './src/index.js'
    ],
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'visualsearch.js',
        publicPath: '/' 
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js','.jsx','.json','.scss','.css']
    },
    module:{
        loaders:[
            { 
                test: [/\.jsx?$/,/\.js?$/], 
                exclude: [
                    path.resolve(__dirname,"/node_modules/")
                ],
                include: [
                    path.resolve(__dirname,'./src')
                ],
                loader:'babel-loader',
                query: { 
                    plugins:['transform-runtime']
                }
            },
            {   enforce: "pre", 
                test: /\.js$/, 
                loader: "source-map-loader" 
            },
            {
                test: /\.scss$/,
                use: ExtractPlugin.extract({
                       fallback: 'style-loader',
                       use:[ 
                       {
                         loader: "css-loader",
                         options: {
                            modules: true,
                            sourceMap: true,
                            importLoaders: 1,
                            localIdentName: "[name]--[local]--[hash:base64:8]"
                         }
                       }, 
                       { loader  : 'sass-loader',
                         options : {
                            includePaths: [
                                path.resolve("./node_modules/")
                            ]
                         } 
                        }] 
                })
            },
             {
                test: /\.css$/,
                use: ExtractPlugin.extract({ 
                       use: [{
                        loader: "css-loader",
                        options: {
                        modules: true,
                        sourceMap: true,
                        importLoaders: 1,
                        localIdentName: "[name]--[local]--[hash:base64:8]"
                        }
                      },
                      "postcss-loader" // has separate config, see postcss.config.js nearby
                      ] })
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    devServer: {
        contentBase: "./dist",
        // do not print bundle build stats
        noInfo: true,
        // enable HMR
        hot: true,
        // embed the webpack-dev-server runtime into the bundle
        inline: true,
        // serve index.html in place of 404 responses to allow HTML5 history
        historyApiFallback: true,
        port: PORT,
        host: HOST
  },
  plugins:[
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new ExtractPlugin({
          filename: 'style.css',
          allChunks: true
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        files: {
            css: ['style.css'],
            js: [ "bundle.js"],
        }
      }),
    
  ]
}
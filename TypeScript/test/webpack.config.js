const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[hash]bundle.js'
  },
  module:{
      rules:[
            {
              test:/\.css$/,
              use:[
                  { loader: "style-loader" },
                  { loader: "css-loader" }
              ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {}
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            }
      ],
  },
  plugins: [new HtmlWebpackPlugin({
      template:'./src/index.html',
        minify:{
            collapseWhitespace: true, //合并空格
            removeComments: true, //删除注释
            removeRedundantAttributes: true,//删除多余的属性
            removeScriptTypeAttributes: true,//删除script标签type
            removeStyleLinkTypeAttributes: true, //删除styletype属性
            useShortDoctype: true //useShortDoctype 用short (HTML5) doctype替换doctype。
        }
  })],
  devServer:{
      contentBase: path.join(__dirname, "public"),
      port: 9000,
      inline: true,
      open: true
  }
};
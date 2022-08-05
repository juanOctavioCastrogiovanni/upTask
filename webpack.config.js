const path = require('path')

module.exports = {
    mode: 'production',
    entry: path.join(__dirname, 'public', 'js', 'app.js'),
    output: {
        path: path.join(__dirname, 'public', 'js', 'dist'),
        filename: 'bundle.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
  };
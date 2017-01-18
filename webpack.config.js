module.exports = {
  context: __dirname,
  entry: './app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: [/\.js$/, /\.es6$/, /\.jsx?$/],
        exclude: /node_modules/,
        loader: 'eslint',
      }
    ],
    loaders: [
      {
        test: [/\.js$/, /\.es6$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  },
}

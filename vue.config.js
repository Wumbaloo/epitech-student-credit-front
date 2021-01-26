module.exports = {
  devServer: {
    port: '8080',
    // https: true
  },
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: (config) => {
    config.optimization = {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.',
        name: undefined,
        cacheGroups: {}
      }
    }
  }
};

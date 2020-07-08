module.exports = {
  devServer: {
    port: '8080',
    https: true,
    proxy: {
      '^/api/': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
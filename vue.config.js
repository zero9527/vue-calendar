module.exports = {
  outputDir: 'docs',
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: config => {
    config.devServer = {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      disableHostCheck: true,
      sockHost: 'localhost',
      sockPort: 2333,
      port: 2333,
      hot: true,
    };
  },
};

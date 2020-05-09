module.exports = {
  outputDir: 'docs',
  publicPath: './',
  productionSourceMap: true,
  configureWebpack: config => {
    config.devServer = {
      port: 2333,
      hot: true,
    };
  },
};

module.exports = {
  outputDir: 'docs',
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: config => {
    config.devServer = {
      port: 2333,
      hot: true,
    };
  },
};

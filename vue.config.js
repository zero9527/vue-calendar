module.exports = {
  outputDir: 'docs',
  publicPath: './',
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: config => {
    // 支持 single-spa与 异步组件 在主项目中正常使用
    config.output.jsonpFunction = 'wpJsonpFlightsWidget';

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

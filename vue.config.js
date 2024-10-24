const path = require('path')


const resolve = dir => path.join(__dirname, dir);

module.exports = 
  {
    lintOnSave:false,
    publicPath: '/',
    // 打包输出
    outputDir: 'dist',
    // configureWebpack: {
    //   plugins: [
    //     new webpack.ProvidePlugin({
    //       introJs: ['intro.js'],
    //     }),//配置introJs
    //   ],
    // },  
  // 链式webpack配置
    chainWebpack: config => {
      // 设置 svg-sprite-loader
      config.module
        .rule('svg')
        .exclude.add(resolve('src/assets/icons'))
        .end()
      config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/assets/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()
    },
   }


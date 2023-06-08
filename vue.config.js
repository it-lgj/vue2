const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath:'./',
  css: {
    loaderOptions: {
      sass: {
        // sass-loader
        additionalData: `
        @import '@/assets/css/mixin.scss';
        @import '@/assets/css/variable.scss';
        @import '@/assets/css/mixin-ml.scss';
        @import '@/assets/css/variable-ml.scss';
        @import '@/assets/css/mixin-zxy.scss';
        @import '@/assets/css/variable-zxy.scss';
        `,
      },
    },
  },
})

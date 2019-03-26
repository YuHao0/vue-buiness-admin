const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
  outputDir:'../webapp',
  indexPath:'WEB-INF/thymeleaf/web/views/index.html',
  chainWebpack: (config)=>{
    config.resolve.alias
      .set('assets',resolve('src/assets'))
      .set('components',resolve('src/components'))
  },
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "src/common/scss/variable.scss";
          @import "src/common/scss/common.scss";
          @import "src/common/scss/elCustom.scss";
        `
      }
    }
  }
};
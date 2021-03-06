/*
 * @Author: wjw
 * @Date: 2020-12-09 09:11:14
 * @LastEditTime: 2021-01-20 10:10:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-punkd:\work\vue-book\vue.config.js
 */
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const vueConfig = {
  publicPath: process.env.NODE_ENV === "development" ? "/" : "./",
  productionSourceMap: process.env.NODE_ENV === "development" ? true : false,
  // 配置路径别名
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("components", resolve("src/components"))
      .set("store", resolve("src/store"))
      .set("views", resolve("src/views"))
      .set("assets", resolve("src/assets"));
  },
  devServer: {
    // host: "localhost",
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    overlay: {
      warnings: false,
      errors: false,
    },
    proxy: {
      "/api": {
        target: process.env.VUE_APP_SERVER_URL,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
	disableHostCheck: true,
  },
  lintOnSave: false,
};
module.exports = vueConfig;

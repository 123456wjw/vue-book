const path = require('path')

function resolve(dir) {
	return path.join(__dirname, dir)
}

const vueConfig = {
	publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
	productionSourceMap: process.env.NODE_ENV === "production" ? false : true,
	// 配置路径别名
	chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('components', resolve('src/components'))
			.set('store', resolve('src/store'))
			.set('views', resolve('src/views'))
			.set('assets', resolve('src/assets'))
	},
	devServer: {
		//host: "localhost",
		port: 8080, // 端口号
		https: false, // https:{type:Boolean}
		open: false, //配置自动启动浏览器
		overlay: {
			warnings: false,
			errors: false
		},
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				pathRewrite: {
					"^/api": ""
				}
			}
		}
	},
	lintOnSave: false
}
module.exports = vueConfig;

import loginState from 'store/modules/loginState/loginState'
let token;
import axios from "axios"
const instance = axios.create({
	baseURL: process.env.NODE_ENV === 'development' ? '/api' : '',
	timeout: 1000 * 120,
	headers: {
		"accept": "application/json",
		'Content-Type': 'application/json'
	}
})
//配置全局请求拦截
instance.interceptors.request.use(
	config => {
		token = loginState.state.token;
		console.log('loginState', loginState)
		if (token) {
			// 这里将token设置到headers中
			config.headers.Authorization = token;
		}
		return config
	},
	error => { //如果请求出错 会在请求catch里捕获
		return Promise.reject(error);
	}
)
//配置全局响应拦截
instance.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		if (error.response) {
			switch (error.response.status) {
				case 400:
					error.message = '400 请求错误'
					break
				case 401:
					error.message = '401 token验证失败'
					break
				case 403:
					error.message = '403 拒绝访问'
					break
				case 404:
					console.log('404');
					error.message = `404 请求地址出错: ${error.response.config.url}`
					break
				case 408:
					error.message = '408 请求超时'
					break
				case 500:
					error.message = '500 服务器内部错误'
					break
				case 501:
					error.message = '服务未实现'
					break
				case 502:
					error.message = '网关错误'
					break
				case 503:
					error.message = '服务不可用'
					break
				case 504:
					error.message = '网关超时'
					break
				case 505:
					error.message = 'HTTP版本不受支持'
					break
				default:
					error.message = "连接服务器异常";
			}
		} else {
			error.message = "连接服务器失败";
		}
		return Promise.reject(error);
	}
)
export function doGet(urll) {
	return new Promise((resolve, reject) => {
		instance({
			method: 'get',
			url: urll
		}).then(response => {
			resolve(response.data)
		}).catch(err => {
			reject(err)
		})
	})
}

export function doPost(urll, params) {
	return new Promise((resolve, reject) => {
		instance({
			method: 'post',
			url: urll,
			data: params
		}).then(response => {
			resolve(response.data);
			//进行提示消息
		}).catch(err => {
			reject(err)
		})
	});
}

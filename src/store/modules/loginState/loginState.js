const state = {
	token: window.localStorage.getItem('token') || '',
	user: JSON.parse(window.localStorage.getItem('user')) || {}
}
const getters = {
	userId(state) {
		return state.user.id
	}
}
const mutations = {
	setToken(state,token='') {
		state.token = token;
	},
	setUser(state,user={}) {
		state.user = user;
	}
}
const actions = {
	_setToken({commit,dispatch,state},params) {
		console.log(params)
	}
}
export default {
	namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
	state,
	getters,
	mutations,
	actions
}
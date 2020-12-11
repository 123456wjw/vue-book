const state = {
	token: localStorage.getItem('token') || '',
	user: JSON.parse(localStorage.getItem('user')) || Object.create(null)
}
const getters = {
	userId(state) {
		return state.user.id
	}
}
const mutations = {
	setToken(state, token = '') {
		state.token = token;
	},
	setUser(state, user = Object.create(null)) {
		state.user = user;
	}
}
export default {
	namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
	state,
	getters,
	mutations,
}

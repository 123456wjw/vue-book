import { SETLOADING,  } from './mutation-types'
const state = {
	loading: false
}
const mutations = {
	[SETLOADING](state,loading=false) {
		state.loading = loading;
	},
}
export default {
	namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
	state,
	mutations,
}
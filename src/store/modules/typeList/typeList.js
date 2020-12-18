import { SETTYPELIST } from './mutationTypes'
const state = {
	typeList: []
}
const mutations = {
	[SETTYPELIST](state,{typeList = []}) {
		state.typeList = typeList;
	},
}
export default {
	namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
	state,
	mutations,
}
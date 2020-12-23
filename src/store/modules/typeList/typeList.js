import { doGet } from 'assets/js/http'
import { SETTYPELIST } from './mutationTypes'
import { GETTYPELIST } from './actionTypes'

const state = {
	typeList: []
}
const mutations = {
	[SETTYPELIST](state,{typeList = []}) {
		state.typeList = typeList;
	},
}
const actions = {
	[GETTYPELIST]({commit}) {
		return new Promise((resolve, reject) => {
			doGet('getType').then(res => {
				if (0 === res.code) {
					commit(SETTYPELIST, {typeList: res.result})
					resolve()
				}
			})
		})
		
	}
}
export default {
	namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
	state,
	mutations,
	actions
}
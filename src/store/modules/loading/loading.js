import { SETLOADING, MUTATIONA, MUTATIONB } from './mutation-types'
const state = {
	loading: false
}
const getters = {
	trueState(state,getters) {
		//state可以访问该module的state getters可以访问该module的getters
		return state.loading
	},
	fngetters: (state,getters,rootState,rootGetters) => (num) => {
		//通过返回一个函数方式可以实现给getters传参数
		console.log('getters',getters);
		console.log('rootState',rootState);
		console.log('rootGetters',rootGetters);
		return num
	}
}
const mutations = {
	setLoading(state,loading=false) {
		state.loading = loading;
	},
	[MUTATIONA](state,params) {
		console.log('mutationA',state,params)
	},
	[MUTATIONB](state,params) {
		console.log('mutationB',state,params)
	}
}
const actions = {
	actionA({commit,dispatch,state,rootState,rootGetters},params) {
		console.log('actionA',params);
		console.log('rootState',rootState);
		console.log('rootGetters',rootGetters);
	},
	actionB({commit,dispatch,state,rootState},params) {
		console.log('actionB',params)
		dispatch('actionA',{name: '我是actionA'});
		commit(MUTATIONB,{name: '我是mutationB'});
		return new Promise((resolve,reject) => {
			setTimeout(() => {
				dispatch('loginState/_setToken',{name: '我是loginState里的_setToken'},{root: true});
				resolve('我返回了')
			},1000)
		})
	}
	
}
export default {
	namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
	state,
	getters,
	mutations,
	actions
}
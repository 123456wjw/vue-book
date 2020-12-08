import Vue from "vue";
import Vuex from "vuex";
import loginState from './modules/loginState/loginState'
import loading from './modules/loading/loading'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		root: '我是root'
	},
	getters: {
		root() {
			return '我是rootGetters'
		}
	},
	mutations: {},
	actions: {},
	modules: {
		loginState,
		loading
	}
});

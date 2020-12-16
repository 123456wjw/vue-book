import store from "../../store";

export function clearLoginState() {
	//清空本地缓存
	window.localStorage.removeItem('token');
	window.localStorage.removeItem('user');
	store.commit('loginState/setToken')
	store.commit('loginState/setUser')
}
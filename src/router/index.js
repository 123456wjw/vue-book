import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter);
const routes = [{
		path: '/',
		name: 'index',
		component: () => import('views/index/index'),
		meta: {
			isShowTarBar: true,
			index: 1
		}
	},
	{
		path: '/findBook',
		name: 'findBook',
		component: () => import('views/findBook/findBook'),
		meta: {
			isShowTarBar: true,
			index: 1
		}
	},
	{
		path: '/personal',
		name: 'personal',
		component: () => import('views/personal/personal'),
		meta: {
			isShowTarBar: true,
			index: 1
		}
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('views/login/login'),
		meta: {
			isShowTarBar: false,
			index: 3
		}
	},
	{
		path: '/setPersonal',
		name: 'setPersonal',
		component: () => import('views/setPersonal/setPersonal'),
		meta: {
			isShowTarBar: false,
			index: 2
		}
	},
	{
		path: '/collect',
		name: 'collect',
		component: () => import('views/collect/collect'),
		meta: {
			isShowTarBar: false,
			index: 2
		}
	},
	{
		path: '/detailBook',
		name: 'detailBook',
		component: () => import('views/detialBook/detialBook'),
		meta: {
			isShowTarBar: false,
			index: 2
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	linkExactActiveClass: 'active',
	routes,
	// scrollBehavior(to, from, savedPosition) {
	// 	console.log(to,from,savedPosition, 'savedPosition')
	// 	if (savedPosition) {
	// 		return savedPosition
	// 	} else {
	// 		return {
	// 			x: 0,
	// 			y: 0
	// 		}
	// 	}
	// }
})

export default router

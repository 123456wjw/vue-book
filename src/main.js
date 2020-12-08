import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'assets/scss/base.scss';
import 'lib-flexible';
//滑动切换路由过渡组件
import RouteTransition from 'vue-route-transition'
Vue.use(RouteTransition)
//移动端滑动切换组件
import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})
//解决移动端点击事件300ms延迟
import fastclick from "fastclick"
fastclick.attach(document.body)
import {
	doGet,
	doPost
} from 'assets/js/http.js'
Vue.prototype.$get = doGet;
Vue.prototype.$post = doPost;
import clipper from 'assets/js/clipper.js'
Vue.use(clipper);
import { 
	Swipe, 
	SwipeItem,
	Lazyload,
	Sticky,
	PullRefresh,
	List,
	SwipeCell,
	Button,
	Loading,
	Toast
} from 'vant';
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Lazyload);
Vue.use(Sticky);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(SwipeCell);
Vue.use(Button);
Vue.use(Loading);
Vue.use(Toast);
Vue.config.productionTip = false;
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  update: function (el) {
    // 聚焦元素
    el.focus()
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

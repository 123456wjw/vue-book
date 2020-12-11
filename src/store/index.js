/*
 * @Author: wjw
 * @Date: 2020-12-09 09:11:14
 * @LastEditTime: 2020-12-09 11:01:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-punkd:\work\vue-book\src\store\index.js
 */
import Vue from "vue";
import Vuex from "vuex";
import loginState from "./modules/loginState/loginState";
import loading from "./modules/loading/loading";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    loginState,
    loading,
  },
});

//引入Vuex和Vue
import Vuex from "vuex";
import Vue from "vue";
import getters from './getters';
import user from './modules/user';
import app from "./modules/app";
// 使用Vuex
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    app
  },
  getters
})

export default store;

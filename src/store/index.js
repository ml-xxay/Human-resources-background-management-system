import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission' //动态路由权限模块
import tagsView from './modules/tagsView'//多页签
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    permission, //动态路由
    tagsView
  },
  getters
})

export default store

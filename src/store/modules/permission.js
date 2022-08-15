/* 
专门处理路由权限的文件
 */
import { constantRoutes, asyncRouter } from '@/router/index' //导入静态路由  动态路由

const state = {
  // 一开始   所有用户都有静态路由的权限
  routes: constantRoutes // 路由表  表示当前登录的用户所拥有的路由权限的路由数组
}

const mutations = {
  // newRoutes 是我们登录成功所添加的新路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes] //所登录的用户 所拥有的权限路由是 静态路由 + 登录时的新路由
  }
}

const actions = {
  // 筛选路由方法  menus我们认为是用户当前登录时所携带的 路由权限的标识
  filterRoutes({ commit }, menus) {
    // menus:['setting','employess']  路由权限标识  对应动态路由的name  
    //asyncRouter:[{path:'/setting',name:'setting'}]  //动态路由
    const newRoutes = []
    menus.forEach(key => {// key 是路由标识的每一项
      console.log(key);
      // 动态路由里面的name有没有 和 用户登陆时所带的标识相等的  相等 筛选出来   
      newRoutes.push(...asyncRouter.filter(item => item.name === key))
    })
    commit('setRoutes', newRoutes)//把删选出来的动态路由  添加进静态路由

    return newRoutes
  }
}

export default {
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
}
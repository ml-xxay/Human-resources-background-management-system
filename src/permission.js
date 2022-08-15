import router from "@/router"; // 引入路由实例
import store from '@/store'// 引入vuex store实例
import nprogress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 创建一个路由白名单
const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面

// 路由前置守卫
router.beforeEach(async function (to, from, next) {
  nprogress.start() // 开启进度条
  //  首先判断有无token
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')//有token访问主页 不让访问login
    } else {
      // 有token  登陆了  在跳转路由之前  获取用户的个人资料
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        // 为什么要写await 因为我们想获取完资料再去放行
        const { roles } = await store.dispatch('user/getUserInfo') //result  是vuex获取用户资料返还回来的数据
        console.log(roles);
        // 我们要在这里筛选用户的可用路由   把获取的用户资料的菜单路由标识传过去roles.menus
        const routes = await store.dispatch('permission/filterRoutes', roles.menus) //调用vuex筛选方法  筛选出当前用户可用的动态路由
        // routes 是筛选返回回来的用户所拥有的动态路由  
        // 我们应该把用户所拥有的 动态路由 添加到 路由表中  默认路由表只有静态路由  我们要加到静态路由中
        console.log(routes);
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])  // 铺路
        next(to.path)// 相当于跳到对应的地址  相当于多做一次跳转
        //  为什么又做了一次跳转
        // 进门了,但是进门之后我要去的地方路还没有铺好,直接走,掉坑里,多做一次跳转,再从门外往里进一次,跳转之前八路铺好,再进来的时候就ok了
      } else {
        next()
      }
    }
  } else {
    // 没有token  访问的又是白名单里面的路径
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      //访问的不是路由白名单里的地址  跳到登录页  说明是有权限的 需要有token
      next('/login')
    }
  }
  nprogress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 后置守卫
router.afterEach(function () {
  nprogress.done() // 关闭进度条
})
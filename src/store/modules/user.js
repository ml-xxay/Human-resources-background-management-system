//token操作  token搭配vuex 只为了做数据持久化
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'//网络请求
import { resetRouter } from '@/router' //重置路由的方法

const state = {
  token: getToken(), //设置token为共享状态 初始化veux的时候就先从缓存中读取
  userInfo: {} //用户的信息
}
const mutations = {
  //点击登陆时把token存到vuex的state里
  setToken(state, token) {
    state.token = token
    //数据持久化  为了防止刷新丢失，我们需要把数据备份到本地存储  为了同步vuex
    setToken(token)
  },
  // 删除缓存和token
  removeToken(state) {
    state.token = null// 先清除 vuex
    removeToken()  // 再清除缓存 让 vuex和 缓存数据的同步
  },
  // 设置用户信息保存到vuex的state里
  setUserInfo(state, userInfo) {//userInfo 是调用这个方式时接收的参数
    state.userInfo = userInfo
  },
  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  //  定义登录请求
  async login({ commit }, data) {//data是调用登录接口时 传过来的参数
    const result = await login(data)
    // if (data.success) {
    //   commit('setToken', result)
    // } 因为在网络请求的响应拦截中   已经把错误对象抛出去了  所以  执行到这里一定是成功的 
    commit('setToken', result)
    setTimeStamp() //设置当前存入token的时间
  },
  // 获取用户资料   async函数所return的数据  用await就可以接收到
  async getUserInfo({ commit }) {
    // 发送请求获取用户信息
    const result = await getUserInfo()
    // 获取用户信息是await 强制转换成同步的  所以走到这里一定是获取成功了 我们在获取用户头像
    const baseInfo = await getUserDetailById(result.userId)
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    commit('setUserInfo', baseResult) // 将整个的个人信息设置到用户的vuex数据中
    return baseResult // 这里为什么要返回 为后面埋下伏笔
  },
  // 退出登录
  logout({ commit }) {
    // 删除token
    commit('removeToken')
    // 删除用户信息
    commit('reomveUserInfo')
    // 重置路由
    resetRouter()
    // 去设置vuex权限模块peimission 为初始状态   就是设置为原先的静态路由
    // 调用vuex子模块的action   都没加锁的情况下  都可以随便调用
    // 不加命名空间的情况下  所有的mutations 和 actions 都是挂载在全局上的  所以可以直接调用  但是加了命名空间的子模块怎么调用另一个命名空间的mutations
    // {root:true}  调用根级的mutations或actions 的方法
    commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  // 开启封闭模式  外面要通过user模块  才能调用里面的方法或数据
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions
}
// 混入
import store from '@/store' //导入vuex

export default {
  methods: {
    // 检查按钮操作权限
    checkPermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        // 有key  返还true  则有权限  可以点
        return userInfo.roles.points.some(item => item === key)
      }
      return false  //无key  没权限 不可以点
    }
  }
}

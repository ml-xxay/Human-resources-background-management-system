import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { IsCheckTimeOut } from '@/utils/auth'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,//基准地址是/api 一访问api 就会触发跨域代理的/api
  timeout: 50000000000000
})

//请求拦截器主要处理 token的**`统一注入问题`**
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (IsCheckTimeOut()) {//这个条件满足说明token过期了
      store.dispatch('user/logout')// token超时了 这个token就不能要了
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    // 如果token没超时且存在 设置请求头
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回配置
}, error => {
  return Promise.reject(error)
})

//响应拦截器主要处理 返回的**`数据异常`** 和**`数据结构`**问题
service.interceptors.response.use(res => {
  const { success, data, message } = res.data
  if (success) {
    return data
  } else {
    // 提示错误消息
    Message.error(message)
    //业务错了 不能进then 应该进catch
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 后端告诉我token超时了
    store.dispatch('user/logout')//删除token 和缓存token
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})
export default service

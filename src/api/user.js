import request from '@/utils/request'

// 登录
export function login(data) {
  // 返回一个Promise对象  因为axios就是异步请求
  return request({
    method: 'POST',
    url: '/sys/login',
    data: data
  })
}

/**
 *  获取用户的基本资料
 *
 * **/
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
/** *
 *
 * 获取用户的头像  为了显示头像   也是获取某个用户的基本信息接口
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {
  return request({})
}

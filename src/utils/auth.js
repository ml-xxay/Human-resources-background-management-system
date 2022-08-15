import Cookies from 'js-cookie'


// const TokenKey = 'hr-saas-111-token' //设置一个独一无二的的key
const TokenKey = 'token' //设置一个独一无二的的key

// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 设置缓存token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 删除token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 手动介入token的key  时间的key
const timeKey = 'hrsaas-timestamp-key' // 设置一个独一无二的key

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}
// 设置时间戳
export function setTimeStamp() {
  Cookies.set(timeKey, Date.now())
}
// 检查token是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
const Timeout = 3600 //设置token为一个小时
export function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳  就是在每次发送请求的时候 的时间
  var timeStamp = getTimeStamp() // 获取当时设置token在缓存时的时间
  return (currentTime - timeStamp) / 1000 > Timeout
}

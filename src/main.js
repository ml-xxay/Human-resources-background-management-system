import Vue from 'vue'
import checkPermission from '@/mixin/checkPermission'//权限
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// import i18n from '@/lang/index' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 导入自定义属性
import * as directives from '@/directives'
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

import * as filters from '@/filters' // 引入工具类
// 注册自定义过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

import Component from '@/components'//引入全局自定义组件
Vue.use(Component) // 注册自定义组件 

import Print from 'vue-print-nb' //引入打印插件
Vue.use(Print); //注册打印插件


// 设置element为当前的语言
// Vue.use(ElementUI, {
//   i18n: (key, value) => i18n.t(key, value)
// })

// 删除了mock文件夹   这个引用就用不到了
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
// 全局混入检查对象
Vue.mixin(checkPermission)  //表示所有组件  都拥有一个检查的放法
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,

  render: h => h(App)
})

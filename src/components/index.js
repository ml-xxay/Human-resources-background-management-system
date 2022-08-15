// 负责所有全局自定义组件的注册

// 引入通用栏组件
import PageTools from './PageTools'
// 引入通用栏组件导入excel组件
import UploadExcel from './UploadExcel'
// 引入上传图片组件
import ImageUpload from './ImageUpload'
// 引入全屏插件
import ScreenFull from './ScreenFull'
// 引入主题插件
import ThemePicker from './ThemePicker'
import TagsView from './TagsView/index.vue'
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    // 注册全局的导入excel组件
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    // 注册全局上传图片组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入的上传图片组件
    Vue.component('ScreenFull', ScreenFull) // 注册全屏插件
    Vue.component('ThemePicker', ThemePicker)// 注册主题插件
    Vue.component('TagsView', TagsView)
  }
}




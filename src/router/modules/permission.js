/*
 权限管理模块路由 
 */
import Layout from '@/layout'
export default {
  path: '/permission', //一访问这个路径 
  component: Layout, // 就到布局页面   一到布局页面就显示二级默认路由
  name: 'permissions', // 给路由规则加一个name   做权限的时候能用到
  children: [
    {
      path: '',// 当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由  //显示下面对应的组件
      component: () => import('@/views/permission'),
      // 路由元信息  其实就是存储数据的对象 我们可以在这里放置任何内容
      meta: {
        title: '权限管理',//为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
        icon: 'lock'
      }
    }
  ],
}
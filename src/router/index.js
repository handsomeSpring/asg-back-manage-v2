const _import = require("./_import");
//引入nprogress
import nProgress from "nprogress";
import "nprogress/nprogress.css";
nProgress.inc(0.2);
nProgress.configure({ easing: "ease", speed: 500, showSpinner: false });
import VueRouter from "vue-router";
import { getToken } from "@/utils/auth";
import { menuOptions } from '@/assets/json/menu.js';
//引入组件
import Login from "@/view/login/index.vue";
import Err from "@/view/Err.vue";
import Layout from '@/view/homepage/index.vue';
import customWorker from "@/view/customWorker/index.vue";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

VueRouter.prototype.replace = function replace(location) {
  return originalPush.call(this, location).catch(err => err)
}

// const createMenuComps = () => {
//   let result = [];
//   menuOptions.forEach(item => {
//     if (item.children && item.children.length > 0) {
//       item.children.forEach(child => {
//         const menu = {
//           path: child.path.replace('/index/', ''),
//           component: _import(child.component),
//           name: child.title,
//         }
//         result.push(menu);
//       })
//     }
//   });
//   return result;
// }
// const asyncRouteList = createMenuComps();

const createMenuComps = () => {
  return menuOptions.map(parent => {
    return {
      path: parent.path.replace('/',''),
      component: (parent.component && parent.component !== 'router-view') ? _import(parent.component) : {
        render: h => h('router-view')
      },
      name: parent.title,
      children:parent.children && parent.children.length > 0 ? parent.children.map(child => {
        return {
          path: child.path.replace(`${parent.path}/`,''),
          component: _import(child.component),
          name: child.title,
        }
      }) : []
    }
  })

}
const asyncRouteList = createMenuComps();
//创建一个路由器
const router = new VueRouter({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [
    {
      path: "/login",
      name: "登录页",
      component: Login,
    },
    {
      path: "/404",
      name: "路径丢失",
      component: Err
    },
    {
      path: "/myCustomWorker",
      name: "自定义工作台",
      component: customWorker
    },
    {
      path: '*',
      name: "无法匹配路由",
      component: Err,
    },
    {
      path: "/",
      component: Layout,
      name: '首页',
      children:[
        ...asyncRouteList
      ]
      // children: [
      //   {
      //     path: "guide",
      //     component: userInfo,
      //     name: "工作台",
      //   },
      //   {
      //     path: "index",
      //     component: visualMap,
      //     name: '数据化大屏'
      //   },
      //   {
      //     path: "schedule",
      //     name: '赛事管理',
      //     component: { // 这时路由页面正常显示, 但这时会嵌套一层router-view; 如果把component注释掉, 页面就空了
      //       render: h => h('router-view')
      //     },
      //     children: [{
      //       path: "manage",
      //       component: userInfo,
      //       name: "赛事管理",
      //     }]
      //   }
      // ]
    },
  ],
});

// 设置白名单，没有token也可以进入的页面
const whiteList = ['/', '/login', '/404', '/index/ballot', '/index/gamepic', '/index/apiTest', '/test']
// 设置路由前置守卫
router.beforeEach((to, from, next) => {
  // if如果为ture，证明有token,只要不跳转到登录页，去哪都行
  nProgress.start()
  if (getToken()) {
    // 只要路由发生了跳转，就可以执行进度条
    // 设置后置守卫，路由跳转成功就可以关闭进度条
    next(true)
    nProgress.done();
  } else {
    // 如果没有token，执行以下代码，
    // if判断要进入的页面是否需要token，
    if (whiteList.includes(to.path)) {
      next(true)
    } else {
      next('/404')
      nProgress.done();
    }
  }
})

router.afterEach(() => {
  nProgress.done();
});
export default router;

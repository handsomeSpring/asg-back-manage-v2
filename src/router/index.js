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
import Shopping from '@/view/shopping/index.vue';
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

// 创建权限菜单
const createMenuComps = () => {
  return menuOptions.map(parent => {
    return {
      path: parent.path.replace('/', ''),
      component: (parent.component && parent.component !== 'router-view') ? _import(parent.component) : {
        render: h => h('router-view')
      },
      name: parent.title,
      children: parent.children && parent.children.length > 0 ? parent.children.map(child => {
        return {
          path: child.path.replace(`${parent.path}/`, ''),
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
      name: "系统登录",
      component: Login,
    },
    {
      path: "/404",
      name: "资源丢失",
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
      redirect: '/404',
      component: Err,
    },
    {
      path: "/",
      component: Layout,
      name: '首页',
      children: [
        ...asyncRouteList,
        {
          path:'/shopping',
          name:'购物中心',
          component:Shopping
        }
      ]
    },
  ],
});

// 设置白名单：登录、404、临时抽签
const whiteList = ['/login', '/404', '/match/ballot']
// 设置路由前置守卫
router.beforeEach((to, from, next) => {
  // if如果为ture，证明有token,只要不跳转到登录页，去哪都行
  nProgress.start()
  if (getToken()) {
    // 只要路由发生了跳转，就可以执行进度条
    // 设置后置守卫，路由跳转成功就可以关闭进度条
    if (to.path === '/') {
      next('/guide');
    } else {
      next(true)
    }
  } else {
    if (to.path === '/') {
      next('/login');
    } else if (whiteList.includes(to.path)) {
      next(true)
    } else {
      next('/404')
    }
  }
  nProgress.done();
})

router.afterEach((to) => {
  document.title = 'ASG赛事后台系统 ——' + to.name;
  nProgress.done();
});
export default router;

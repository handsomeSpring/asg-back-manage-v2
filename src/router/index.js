//引入nprogress
import nProgress from "nprogress";
import "nprogress/nprogress.css";
nProgress.inc(0.2);
nProgress.configure({ easing: "ease", speed: 500, showSpinner: false });
import VueRouter from "vue-router";
import { getToken } from "@/utils/auth";
//引入组件
import Login from "@/view/login/index.vue";
import MobileLogin from "@/view/login/MobileLogin.vue";
import Err from "@/view/Err.vue";
import customWorker from "@/view/customWorker/index.vue";
import store from '@/store/index';
import { getPermission, getUserInfo } from '@/utils/permission.js';
import Layout from '@/view/homepage/index.vue';
import userInfo from '@/view/userInfo/index.vue';
import { isMobile } from "@/utils";
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

VueRouter.prototype.replace = function replace(location) {
  return originalPush.call(this, location).catch(err => err)
}

//创建一个路由器
const router = new VueRouter({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [
    {
      path: "/login",
      name: "系统登录",
      // component:isMobile() ? MobileLogin : Login
      component: Login
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
      path: "/mobileGuide",
      component: Layout,
      name: '移动端首页',
    },
    {
      path: "/",
      component: Layout,
      redirect: '/login',
      name: 'home',
      children: [
        {
          path: "userInfo",
          component: userInfo,
          name: '个人中心',
        }
      ]
    }
  ],
});
// 设置白名单：登录、404、临时抽签
const whiteList = ['/login', '/404']
// 设置路由前置守卫
router.beforeEach(async (to, from, next) => {
  const hasToken = getToken();
  // if如果为ture，证明有token,只要不跳转到登录页，去哪都行
  nProgress.start();
  // const beforeUploadPath = sessionStorage.getItem('beforeupload-path');
  // const lastUrl = window.location.hash;
  // const fullHashPath = '#' + beforeUploadPath;
  // if (beforeUploadPath && fullHashPath ===  lastUrl) {
  //   await getPermission();
  //   sessionStorage.removeItem('beforeupload-path')
  //   router.replace(beforeUploadPath) //replace,保证浏览器回退的时候能直接返回到上个页面，不会叠加
  // }
  // if (getToken()) {
  //   // 只要路由发生了跳转，就可以执行进度条
  //     next()
  // } else {
  //   if (to.path === '/') {
  //     next('/login');
  //   } else if (whiteList.includes(to.path)) {
  //     next(true)
  //   } else {
  //     next('/404')
  //   }
  // }
  const isAddRouter = store?.getters?.isAddRouter ?? false;
  if (to.path === '/login' && hasToken) {
    next(isMobile() ? '/mobileGuide' : '/guide');
  }
  if (whiteList.indexOf(to.path) === -1) {
    if (hasToken) {
      if (!isAddRouter) {
        store.commit("SET_ROUTERSTATE", true);
        // 获取动态路由和获取用户信息
        const result = await getUserInfo();
        if (result) {
          store.commit("removeToken");
          sessionStorage.removeItem('baseImg');
          store.commit("SET_WAITDO_NUMBER", null);
          store.commit("SET_WAITAUTH_NUMBER", null);
          store.commit("SET_ROUTERSTATE", false);
          router.push("/login");
          next('/login');
        } else {
          store.commit("SET_FULL_LOADING", false);
          await getPermission();
          next({ ...to, replace: true })
        }
      } else {
        if (to.matched.length === 0) {
          next('/404');
        } else {
          next();
        }
      }
    } else {
      if (['/mobileGuide', '/guide'].includes(to.path)) {
         next('/login');
      } else {
        if (to.matched.length === 0) {
          next('/404');
        } else {
          next();
        }
      }
    }
  } else {
    next();
  }
  nProgress.done();
})

router.afterEach((to) => {
  document.title = 'ASG赛事后台系统 ——' + to.name;
  store.commit("SET_TITLE", to.name);
  nProgress.done();
});
export default router;

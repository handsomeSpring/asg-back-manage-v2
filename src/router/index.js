//引入nprogress
import nProgress from "nprogress";
import "nprogress/nprogress.css";
nProgress.inc(0.2);
nProgress.configure({ easing: "ease", speed: 500, showSpinner: false });
import VueRouter from "vue-router";
import { getToken } from "@/utils/auth";
//引入组件
import Login from "@/view/login/index.vue";
import Err from "@/view/Err.vue";
import visualMap from '@/view/homepage/index.vue';
import homePage from '@/view/newHome/index.vue';
import userInfo from "@/view/homepage/Home.vue";
import dragMap from "@/view/drag/index.vue";
import personManager from "@/view/person/index.vue";
import scheduleManager from "@/view/schedule/index.vue";
import enrollManager from "@/view/enroll";
import blokManager from '@/view/blok';
import newsManager from '@/view/news';
import Test from "@/view/test/index.vue";
import ballot from "@/view/ballot/index.vue";
import workFlow from "@/view/workflow/index.vue";
import gamePic from "@/view/gamepic/index.vue";
import sendE from "@/view/sendE/index.vue";
import banPick from "@/view/banpick/index.vue";
import privatePage from "@/view/private/index.vue";
import globalPage from "@/view/global/index.vue";
import exchangePage from "@/view/exchange/index.vue";
import jsPlumb from "@/view/jsplumb/index.vue";
import storeManager from "@/view/storeManager/index.vue";
import managerChange from "@/view/storeManager/managerChange.vue";
import customWorker from "@/view/customWorker/index.vue";
import taskManager from "@/view/taskManager/index.vue";
import shoppingClass from '@/view/shopping/index.vue';
import AsgIntroduction from '@/view/introduction/index.vue';
import budgetIndex from '@/view/budget/index.vue';
import scheduleMaker from '@/view/scheduleMaker/index.vue';
import taskGiving from '@/view/person/components/management.vue';
import menuConfig from '@/view/menuConfig/index.vue';
const originalPush = VueRouter.prototype.push
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
      path: "/",
      alias: "/login",
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
      name: "工作台",
      component: customWorker
    },
    {
      path: '*',
      name: "无法匹配路由",
      component: Err,
    },
    {
      path: "/index",
      component: visualMap,
      name: '首页',
      children: [
        {
          path: "/",
          component: homePage,
        },
        {
          path: "information",
          component: userInfo,
          name: "工作台",
        },
        {
          path: "task",
          component: taskManager,
          name: "任务审核管理",
        },
        {
          path: "drag",
          component: dragMap,
          name: "晋升图制作"
        },
        {
          path: "person",
          component: personManager,
          name: "用户管理"
        },
        {
          path: "schedule",
          component: scheduleManager,
          name: "赛程管理"
        },
        {
          path: "enroll",
          component: enrollManager,
          name: "报名管理"
        },
        {
          path: "champion",
          component: blokManager,
          name: "冠军发布"
        },
        {
          path: "news",
          component: newsManager,
          name: "公告发布"
        },
        {
          path: "test",
          component: Test,
          name: "导出表单"
        },
        {
          path: "ballot",
          component: ballot,
          name: "抽签管理"
        },
        {
          path: "workflow",
          component: workFlow,
          name: "流程下发"
        },
        // 导出赛程图
        {
          path: "gamepic",
          component: gamePic,
          name: "对战图制作"
        },
        //发布邮箱
        {
          path: "sendEmail",
          component: sendE,
          name: "邮箱发布"
        },
        // 黑白名单
        {
          path: "banpick",
          component: banPick,
          name: "合作伙伴"
        },
        {
          path: "private",
          component: privatePage,
          name: "隐私政策"
        },
        {
          path: "globalVar",
          component: globalPage,
          name: "全局参数"
        },
        {
          path: "exchange",
          component: exchangePage,
          name: "解说审核管理"
        },
        {
          path: "jsplumb",
          component: jsPlumb,
          name: "流程审批"
        },
        {
          path: "storeManager",
          component: storeManager,
          name: "商品发布管理"
        },
        {
          path: "storeVerify",
          component: managerChange,
          name: "商品核销管理"
        },
        {
          path: "shopping",
          component: shoppingClass,
          name: '购物中心'
        },
        {
          path: "introduction",
          component: AsgIntroduction,
          name: '操作手册'
        },
        {
          path: "budget",
          component: budgetIndex,
          name: '预算录入',
        },
        {
          path: "scheduleMaker",
          component: scheduleMaker,
          name: '赛程模板制作'
        },
        {
          path: 'taskGiving',
          component:taskGiving,
          name: '任务下发'
        },
        {
          path: 'menuConfig',
          component: menuConfig,
          name: '菜单配置'
        }
      ],
    },
  ],
});

// 设置白名单，没有token也可以进入的页面
const whiteList = ['/', '/404', '/index/ballot', '/index/gamepic', '/index/apiTest', '/test']
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

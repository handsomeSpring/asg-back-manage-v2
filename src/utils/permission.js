import { menuOptions } from "@/assets/json/menu";
import Shopping from '@/view/shopping/index.vue';
import Layout from '@/view/homepage/index.vue';
import router from "@/router/index.js";
const _import = require("@/router/_import.js");
// 创建权限菜单
const createMenuComps = (menu) => {
    return menu.map(parent => {
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

export async function getPermission() {
    const asyncRouteList = createMenuComps(menuOptions);
    asyncRouteList.forEach(item => {
        router.addRoute('home', item);
    });
    router.addRoute('home', {
        path: '/shopping',
        name: '购物中心',
        component: Shopping
    })
}
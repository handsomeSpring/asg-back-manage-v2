import Shopping from '@/view/shopping/index.vue';
import store from '@/store/index';
import router from "@/router/index.js";
const _import = require("@/router/_import.js");
import { getMenu } from "@/api/home/index.js";
import Err from '@/view/Err.vue';
function importComponent(componentPath){
    try {
        return _import(componentPath);
    } catch (error) {
        console.log(error,'找不到模块！');
        return Err;
    }
};
// 创建权限菜单
const createMenuComps = (menu) => {
    return menu.map(parent => {
        return {
            path: parent.path.replace('/', ''),
            component: (parent.component && parent.component !== 'router-view') ? importComponent(parent.component) : {
                render: h => h('router-view')
            },
            name: parent.title,
            children: parent.children && parent.children.length > 0 ? parent.children.map(child => {
                return {
                    path: child.path.replace(`${parent.path}/`, ''),
                    component: importComponent(child.component),
                    name: child.title,
                }
            }) : []
        }
    })
}

function filterMenu(auth) {
    const roles = store.state?.user?.userInfo?.roleListCode ?? '';
    const roleArray = !!roles ? roles.split(',') : [];
    const authArray = !!auth ? auth.split(',') : [];
    if (authArray.length === 0) {
        return true;
    }
    let flag = false;
    for (let i = 0; i < auth.length; i++) {
        if (roleArray.includes(authArray[i])) {
            flag = true;
        }
    }
    return flag;
}
function generateMenu(menu = []) {
    return menu.filter(item => {
        return filterMenu(item.auth) && item.show === '1'
    }).map(item => {
        return {
            ...item,
            children: generateMenu(item.children)
        }
    })
}

export async function getPermission() {
    try {
        const { data, status } = await getMenu();
        if (status !== 200) throw new Error('获取菜单失败！');
        const transferMenu = data?.data ?? [];
        const menu = generateMenu(transferMenu);
        const filterMenu = menu.filter(item => {
            return item.component !== 'router-view' || (item.component === 'router-view' && item.children.length > 0);
        })
        store.commit('GENERATE_MENU', filterMenu);
        const asyncRouteList = createMenuComps(filterMenu);
        asyncRouteList.forEach(item => {
            router.addRoute('home', item);
        });
        router.addRoute('home', {
            path: '/shopping',
            name: '购物中心',
            component: Shopping
        })
    } catch (error) {
        console.log(error.message);
    }
}
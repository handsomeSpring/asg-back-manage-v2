import Shopping from '@/view/shopping/index.vue';
import store from '@/store/index';
import router from "@/router/index.js";
const _import = require("@/router/_import.js");
import { getMenu } from "@/api/home/index.js";
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
        return filterMenu(item.auth)
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
        console.log(transferMenu,'tranferMenu')
        const menu = generateMenu(transferMenu);
        console.log(menu);
        store.commit('GENERATE_MENU', menu);
        const asyncRouteList = createMenuComps(data.data);
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
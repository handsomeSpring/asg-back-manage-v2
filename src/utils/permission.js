import Shopping from '@/view/shopping/index.vue';
import store from '@/store/index';
import router from "@/router/index.js";
const _import = require("@/router/_import.js");
import { getMenu } from "@/api/home/index.js";
import { isMobile } from '@/utils/index';
import { getInfo } from "@/api/home";
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

// 适配性 '1' pc '2' 移动端 '3' pc移动互通
function getAdaptability(adaptability){
    return isMobile() ? ['2','3'].includes(adaptability) : ['1','3'].includes(adaptability);
};
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
        return filterMenu(item.auth) && item.show === '1' && getAdaptability(item.adaptability)
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

// 获取个人信息
export async function getUserInfo(){
  try {
    const { data,status } = await getInfo();
    if(status !== 200) throw new Error('错误了');
    store.commit("getUserInfo", data);
    window.sessionStorage.setItem("money", data.money);
    window.sessionStorage.setItem("baseImg", data.base64);
    window.sessionStorage.setItem("chinaname", data.chinaname);
    window.sessionStorage.setItem("officium", data.officium);
    window.sessionStorage.setItem("id", data.id);
    window.sessionStorage.setItem("isadmin", data.isadmin);
    window.sessionStorage.setItem("money", data.money);
  } catch (error) {
    console.log(error.message);
    return new Promise(resolve => {
        resolve(true)
    })
  }
}
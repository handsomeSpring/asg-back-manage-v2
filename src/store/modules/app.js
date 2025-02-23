const app = {
    state: {
        isCollapse: false, //控制菜单的展开还是收起
        roleList:[], //职位配置
        adminList:[],
        isAddRouter:false, //是否添加了路由配置
    },
    mutations: {
        //修改菜单展开收起的方法
        collapseMenu(state) {
            state.isCollapse = !state.isCollapse
        },
        initRoleList(state,data){
            state.roleList = data;
        },
        SET_ADMIN(state, admin){
            state.adminList = admin;
        },
        ADD_ADMIN(state, user){
            state.adminList.push(user);
        },
        SET_ROUTERSTATE(state, bool){
            state.isAddRouter = bool;
        }
    },
    actions:{}
};

export default app;
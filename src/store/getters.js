const getters = {
    userInfo: state => state.user.userInfo,
    token:state => state.user.token,
    isCollapse:state => state.app.isCollapse,
    roleList:state => state.app.roleList,
    menuOptions:state => state.user.menu,
    adminList:state => state.app.adminList,
    roles:state => state.user.userInfo.roleListName,
    waitDoNumber:state => state.user.waitDoNumber,
    waitAuthNumber:state => state.user.waitAuthNumber,
    isAddRouter:state => state.app.isAddRouter,
    gettersLoading:state => state.app.fullLoading
};
export default getters;
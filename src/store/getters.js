const getters = {
    userInfo: state => state.user.userInfo,
    token:state => state.user.token,
    isCollapse:state => state.app.isCollapse,
    roleList:state => state.app.roleList,
    menuOptions:state => state.user.menu,
    adminList:state => state.app.adminList,
    roles:state => state.user.userInfo.roleListName
};
export default getters;
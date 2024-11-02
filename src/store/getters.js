const getters = {
    userInfo: state => state.user.userInfo,
    token:state => state.user.token,
    isCollapse:state => state.app.isCollapse,
    roleList:state => state.app.roleList,
    menuOptions:state => state.app.menu,
    adminList:state => state.app.adminList
};
export default getters;
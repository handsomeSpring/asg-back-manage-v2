import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
    state: {
        token: getToken(),
        userInfo: {},
        menu:[]
    },
    mutations: {
        setToken(state, token) {
            //第一次拿到token写
            state.token = token;
            setToken(token);
        },
        removeToken(state) {
            state.token = null;
            state.userInfo = {};
            state.menu = [];
            removeToken();
        },
        //存储用户数据
        getUserInfo(state, info) {
            state.userInfo = info
        },
        //修改查询队伍详细信息的name
        updateTeamName(state, team_name) {
            state.team_name = team_name
        },
        SET_LOGO(state, value) {
            state.userInfo.base64 = value;
            sessionStorage.setItem('base64', value);
        },
        UPDATE_NAME(state, value) {
            state.userInfo.chinaname = value;
            sessionStorage.setItem('chinaname', value);
        },
        UPDATE_QQ(state, value) {
            state.userInfo.qqnumber = value;
            sessionStorage.setItem('qqnumber', value);
        },
        GENERATE_MENU(state, menu){
            state.menu = menu;
        }
    },
    actions:{}
};

export default user;

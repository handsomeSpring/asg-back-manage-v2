import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
    state: {
        token: getToken(),
        userInfo: {},
        team_name: '',
        team1_name: '',
        team2_name: '',
        adminRoles: '0'
    },
    mutations: {
        setToken(state, token) {
            //第一次拿到token写
            state.token = token;
            setToken(token);
        },
        removeToken(state) {
            state.token = null;
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
        setAdmin(state, value) {
            state.adminRoles = value;
        },
        UPDATE_NAME(state, value) {
            state.userInfo.chinaname = value;
            sessionStorage.setItem('chinaname', value);
        }
    },
    actions:{}
};

export default user;

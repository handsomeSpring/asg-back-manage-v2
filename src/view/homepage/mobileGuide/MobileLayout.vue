<template>
    <div class="mobile_layout__container">
        <div class="mobile-layout__header">
            <el-image :src="avatar" class="user-avatar" @click="goBack('userInfo')">
                <div slot="error">
                    <img class="error-image" src="@/assets/images/logo.png" />
                </div>
            </el-image>
            <h2>ASG后台管理系统</h2>
            <i class="el-icon-s-tools asg-operation-icon" @click="openDrawer"></i>
        </div>
        <div class="mobile-layout__main">
            <transition name="fade-transform" mode="out-in">
                <component v-if="$route.fullPath === '/mobileGuide'" :is="homePageComp"></component>
                <router-view v-else></router-view>
            </transition>
        </div>
        <transition name="el-zoom-in-bottom">
            <div v-show="$route.fullPath === '/mobileGuide'" class="mobile-layout__footer">
                <div class="footer-tab" :class="homePageComp === 'homePage' ? 'active' : ''"
                    @click="handleChange('homePage')">
                    <svg-icon iconClass="home" width="20px" height="20px"
                        :color="homePageComp === 'homePage' ? '#F7E751' : '#fff'"></svg-icon>
                    <p>系统首页</p>
                </div>
                <div class="footer-tab" :class="homePageComp === 'taskPage' ? 'active' : ''"
                    @click="handleChange('taskPage')">
                    <svg-icon iconClass="taskPush" width="20px" height="20px"
                        :color="homePageComp === 'taskPage' ? '#F7E751' : '#fff'"></svg-icon>
                    <p>任务清单</p>
                </div>
                <div class="footer-tab" :class="homePageComp === 'userInfo' ? 'active' : ''"
                    @click="handleChange('userInfo')">
                    <svg-icon iconClass="mobileUserInfo" width="20px" height="20px"
                        :color="homePageComp === 'userInfo' ? '#F7E751' : '#fff'"></svg-icon>
                    <p>个人中心</p>
                </div>
            </div>
        </transition>
        <!-- 抽屉 -->
        <el-drawer size="70%" title="我是标题" :visible.sync="drawer" :with-header="false">
            <div class="menu-drawer-container">
                <div class="menu-content">
                    <template v-if="adapterMenu.length > 0">
                        <div class="content-parent" v-for="(menu, index) in adapterMenu" :key="index">
                            <div class="menu_header">
                                <div class="menu-title"><svg-icon class="svg-icon" color="#4090EF"
                                        :iconClass="menu.iconClass"></svg-icon>{{
                                            menu.title }}</div>
                            </div>
                            <div class="child-menu" v-for="(child, childI) in menu.children" :key="`child-${childI}`"
                                @click="handleJump(child)">
                                <svg-icon class="svg-icon" color="#000" width="16px" height="16px"
                                    :iconClass="child.iconClass"></svg-icon>
                                <p class="menu-text">{{ child.title }}</p>
                            </div>
                        </div>
                    </template>
                    <el-empty v-else description="您没有任何权限菜单，请联系管理员"></el-empty>
                </div>
                <div class="operation-btnlist">
                    <div class="my-button__wrap goback" @click="goBack('homePage')">返回首页</div>
                    <div class="my-button__wrap logout" @click="handleLogout">退出登录</div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import userInfo from './components/userInfo.vue';
import taskPage from './components/mobileTask.vue';
import homePage from './components/mobileHomePage.vue';
export default {
    name: 'MobileLayout',
    components: {
        userInfo,
        taskPage,
        homePage
    },
    computed: {
        ...mapGetters(['userInfo', 'menuOptions']),
        avatar() {
            return this.userInfo.base64 || sessionStorage.getItem("baseImg");
        },
        adapterMenu() {
            return this.menuOptions.filter(item => item.children.length > 0);
        }
    },
    data() {
        return {
            homePageComp: 'homePage',
            drawer: false
        };
    },
    methods: {
        handleJump(row) {
            this.$router.push(row.path);
            this.drawer = false;
        },
        routerTo() {
            this.$router.push({ path: '/publish/news' })
        },
        handleChange(comp) {
            this.homePageComp = comp;
        },
        openDrawer() {
            this.drawer = true;
        },
        async handleLogout() {
            try {
                const flag = await this.$confirm('您确定退出登录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (flag === 'confirm') {
                    this.$store.commit("removeToken");
                    sessionStorage.removeItem('baseImg');
                    this.$store.commit("SET_WAITDO_NUMBER", null);
                    this.$store.commit("SET_WAITAUTH_NUMBER", null);
                    this.$router.push("/login");
                    this.$message.warning("您已退出登录！");
                }
            } catch (error) {
                if (typeof error === 'string' && error === 'cancel') return;
            }
        },
        goBack(comp) {
            this.homePageComp = comp;
            this.$router.push({ path: '/mobileGuide' });
            this.drawer = false;
        },
    }
}
</script>
<style lang='less' scoped>
@import url('../../../assets/mobileStyles/homePage/index.less');
</style>
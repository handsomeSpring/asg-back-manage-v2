<template>
    <div class="mobile_layout__container">
        <div class="mobile-layout__header">
            <img class="user-avatar" :src="avatar">
            <h2>ASG后台管理系统</h2>
            <i class="el-icon-s-tools asg-operation-icon" @click="openDrawer"></i>
        </div>
        <div class="mobile-layout__main">
            <transition name="fade-transform" mode="out-in">
                <router-view></router-view>
            </transition>
            <component :is="homePageComp"></component>
        </div>
        <div class="mobile-layout__footer">
            <div class="footer-tab" :class="homePageComp === 'homePage' ? 'active' : ''"
                @click="handleChange('homePage')">
                <svg-icon iconClass="default" width="16px" height="16px"
                    :color="homePageComp === 'homePage' ? '#F7E751' : '#fff'"></svg-icon>
                <p>首页</p>
            </div>
            <div class="footer-tab" :class="homePageComp === 'taskPage' ? 'active' : ''"
                @click="handleChange('taskPage')">
                <svg-icon iconClass="default" width="16px" height="16px"
                    :color="homePageComp === 'taskPage' ? '#F7E751' : '#fff'"></svg-icon>
                <p>任务</p>
            </div>
            <div class="footer-tab" :class="homePageComp === 'userInfo' ? 'active' : ''"
                @click="handleChange('userInfo')">
                <svg-icon iconClass="default" width="16px" height="16px"
                    :color="homePageComp === 'userInfo' ? '#F7E751' : '#fff'"></svg-icon>
                <p>个人</p>
            </div>
        </div>
        <!-- 抽屉 -->
        <el-drawer size="50%" title="我是标题" :visible.sync="drawer" :with-header="false">
            <span>我来啦!</span>
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
        ...mapGetters(['userInfo']),
        avatar() {
            return this.userInfo.base64 || sessionStorage.getItem("baseImg");
        }
    },
    data() {
        return {
            homePageComp: 'homePage',
            drawer:false
        };
    },
    methods: {
        routerTo() {
            this.$router.push({ path: '/publish/news' })
        },
        handleChange(comp) {
            this.homePageComp = comp;
        },
        openDrawer(){
            this.drawer = true;
        }
    }
}
</script>
<style lang='less' scoped>
@import url('../../../assets/mobileStyles/homePage/index.less');
</style>
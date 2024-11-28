<template>
    <div class="mobile-content">
        <header>
            <el-image :src="userAvatar" class="avatar">
                <div slot="error">
                    <img style="width: 50px; height: 50px" src="@/assets/images/logo_black.png" />
                </div>
            </el-image>
            <div>
                <p class="user-info">
                    <span class="chinaname">{{ myUser }}</span>
                    <span class="identify__content">
                        {{ officium | filterRole }}
                    </span>
                </p>
                <p class="role">{{ roles || '普通人员' }}</p>
            </div>
        </header>
        <el-scrollbar class="scrollBar">
            <div class="tab-list">
                <div class="tab-item" :class="activeName === '1' ? 'active' : ''" @click="handleRun('1')">首页</div>
                <div class="tab-item" :class="activeName === '2' ? 'active' : ''" @click="handleRun('2')">任务卡</div>
                <div class="tab-item" :class="activeName === '3' ? 'active' : ''" @click="handleRun('3')">个人中心</div>
            </div>
            <homePage v-show="activeName === '1'"></homePage>
            <mobileTask v-if="activeName === '2'"></mobileTask>
            <userInfo v-if="activeName === '3'"></userInfo>
        </el-scrollbar>
    </div>
</template>

<script>
import homePage from "./components/homePage.vue";
import mobileTask from "./components/mobileTask.vue";
import userInfo from "./components/userInfo.vue";
import { mapGetters } from "vuex";
export default {
    name: 'mobileGuide',
    data() {
        return {
            activeName: '1'
        }
    },
    components: {
        homePage,
        mobileTask,
        userInfo
    },
    methods:{
        handleRun(type){
           this.activeName = type;
        },
    },
    computed: {
        ...mapGetters(["userInfo", "roles"]),
        myUser() {
            return this.userInfo.chinaname;
        },
        userAvatar() {
            return this.userInfo.base64;
        },
        officium() {
            return this.userInfo.officium;
        },
    },

}
</script>
<style lang='less' scoped>
.mobile-content {
    header {
        border-bottom: 1px solid #4090EF;
        background: linear-gradient(172deg, #B3D4FF 0%, rgba(255, 255, 255, 0) 93%);
        border-image: linear-gradient(169deg, rgba(167, 214, 237, 0.3), rgba(122, 183, 255, 0.3)) 1 1;
        padding: 1.3em 1em;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 1em;
        height: calc(100px - 2.6em);
        margin-bottom: 0.8em;

        .avatar {
            width: 50px;
            height: 50px;
            border-radius: 6px;
            flex-shrink: 0;
        }

        .user-info {
            flex-shrink: 0;
            font-family: 'hk';
            font-weight: 500;
            display: flex;
            align-items: baseline;

            .chinaname {
                font-size: 1.2em;
                margin-right: 1em
            }

            .identify__content {
                color: #F78235;
                font-size: 0.7em;
                padding: 6px 8px;
                font-weight: 500;
                border-radius: 3px;
            }
        }

        .role {

            font-size: 12px;
            font-weight: 500;
            color: #979797;
        }
    }

    // 主体
    .scrollBar {
        width: 100%;
        height: calc(100dvh - 100px);

        // 导航栏
        .tab-list {
            width: 90%;
            margin: 0.5em auto;
            border-radius: 6px;
            border: 1px solid #e7e7e7;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            height: 2em;
            overflow: hidden;
            transition: 0.27s all;
            .tab-item {
                font-size: 13px;
                font-weight: 600;
                font-family: 'hk';
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;

                &:nth-child(1) {
                    border-right: 1px solid #e7e7e7;
                }

                &:nth-child(2) {
                    border-right: 1px solid #e7e7e7;
                }

                &.active {
                    background: #4090EF;
                    color: #FFF;
                }
            }
        }
    }
}
</style>
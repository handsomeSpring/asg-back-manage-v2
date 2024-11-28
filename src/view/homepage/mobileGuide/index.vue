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
                <p class="role">{{ roles }}</p>
            </div>
        </header>
        <el-scrollbar class="scrollBar">
            <div class="content-parent" v-for="(menu, index) in adapterMenu" :key="index">
                <div class="menu_header">
                    <p>{{ menu.title }}</p>
                </div>
                <div class="grid-parent">
                    <div class="grid-item" v-for="(child, childI) in menu.children" :key="`child-${childI}`" @click="handleJump(child)">
                        <svg-icon color="#979797" width="16px" height="16px" :iconClass="child.iconClass"></svg-icon>
                        <p class="menu-text">{{ child.title }}</p>
                    </div>
                </div>
            </div>
            <div class="btn-wrap">
                <el-button class="el-my-button" type="danger" size="small" @click="logout">退出登录</el-button>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: 'mobileGuide',
    computed: {
        ...mapGetters(["userInfo", "roles", "menuOptions"]),
        myUser() {
            return this.userInfo.chinaname;
        },
        userAvatar() {
            return this.userInfo.base64;
        },
        officium() {
            return this.userInfo.officium;
        },
        adapterMenu() {
            return this.menuOptions.filter(item => item.children.length > 0);
        }
    },
    methods: {
        handleJump(row){
            this.$message.warning('待开发中...');
        },
        async logout() {
            try {
                const flag = await this.$confirm('您确定退出登录吗?', '提示', {
                    customClass: 'mobile-el-confirm',
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
    }
}
</script>
<style lang='less' scoped>
.mobile-content {
    header {
        border-bottom:1px solid #4090EF;
        background: linear-gradient(172deg, #B3D4FF 0%, rgba(255, 255, 255, 0) 93%);
        border-image: linear-gradient(169deg, rgba(167, 214, 237, 0.3), rgba(122, 183, 255, 0.3)) 1 1;
        padding: 1.3em 1em;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
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

        .content-parent {
            width: 90%;
            margin: 2em auto;
            background: #F6F7FA;
            box-shadow: 0px 2px 7px 3px rgba(39, 115, 237, 0.2);
            border-radius: 8px;

            .menu_header {
                padding: 0.8em;
                border-bottom: 1px solid #e7e7e7;
                font-size: 0.8em;
                font-weight: bold;
                font-family: 'hk';
            }

            .grid-parent {
                width: 100%;
                display: grid;
                grid-template-columns: 25% 25% 25% 25%;

                .grid-item {
                    width: 80%;
                    margin: 10%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    justify-content: center;
                    gap: 0.5em;

                    .menu-text {
                        font-size: 11px;
                        color: #303030;
                        width: 100%;
                        text-align: center;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }

        .btn-wrap {
            width: 90%;
            margin: 2em auto;

            .el-my-button {
                width: 100%;
            }
        }

    }
}
</style>
<template>
    <div class="home-content">
        <div class="content-parent" v-for="(menu, index) in adapterMenu" :key="index">
            <div class="menu_header">
                <div class="menu-title"><svg-icon color="#4090EF" :iconClass="menu.iconClass"></svg-icon>{{ menu.title }}</div>
            </div>
            <div class="grid-parent">
                <div class="grid-item" v-for="(child, childI) in menu.children" :key="`child-${childI}`"
                    @click="handleJump(child)">
                    <svg-icon color="#979797" width="16px" height="16px" :iconClass="child.iconClass"></svg-icon>
                    <p class="menu-text">{{ child.title }}</p>
                </div>
            </div>
        </div>
        <div class="btn-wrap">
            <el-button class="el-my-button" type="danger" size="small" @click="logout">退出登录</el-button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: 'HomePage',
    computed: {
        ...mapGetters(["menuOptions"]),
        adapterMenu() {
            return this.menuOptions.filter(item => item.children.length > 0);
        }
    },
    methods: {
        handleJump(row) {
            this.$router.push(row.path);
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
    },
    created() {

    },
}
</script>
<style lang='less' scoped>
.home-content {
    margin-top: 12px;
    .content-parent {
        width: 90%;
        margin: 0 auto 1em;
        background: #FFF;
        border:1px solid #e7e7e7;
        border-radius: 4px;

        .menu_header {
            padding: 0.8em;
            border-bottom: 1px solid #e7e7e7;
            font-size: 0.8em;
            font-weight: bold;
            font-family: 'hk';
            .menu-title{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap:0.5em;
            }
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
</style>
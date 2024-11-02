<template>
    <el-scrollbar class="comp__container--absolute">
        <TextTitle titleName="个人信息"></TextTitle>
        <div class="main__body">
            <div class="flex__container">
                <el-image :src="userInfo.base64" style="width:100%; height: 100%; border-radius: 10px;">
                    <div slot="error">
                        <img style="width: 8em; height: 8em; border-radius: 10px;flex:1" src="@/assets/logo_black.png">
                    </div>
                </el-image>
            </div>
            <div>
                <p class="one__line"><span class="title">中文名：</span>{{ userInfo.chinaname }}</p>
                <p class="one__line"><span class="title">用户id：</span>{{ userInfo.id }}
                    <span class="admin__blue" v-if="isAdmin"><i class="el-icon-s-custom"></i>管理员</span>
                    <span class="admin__blue" v-if="isSuperAdmin"><i class="el-icon-s-custom"></i>超级管理员</span>
                </p>
                <p class="one__line"><span class="title">账号：</span>{{ userInfo.name }}</p>
                <p class="one__line"><span class="title">QQ：</span>{{ userInfo.qqnumber || '未绑定' }}</p>
                <p class="one__line"><span class="title">职位：</span>{{ userInfo.officium | filterRole }}</p>
                <p class="one__line"><span class="title">积分：</span>{{ userInfo.money || 0 }}</p>
            </div>
        </div>
    </el-scrollbar>
</template>

<script>
import TextTitle from "@/components/TextTitle.vue";
import { mapGetters } from "vuex";

export default {
    name: 'asgUserInfo',
    text: '个人信息',
    components: {
        TextTitle,
    },
    computed: {
        ...mapGetters(['userInfo']),
        isAdmin() {
            return Array.isArray(this.userInfo.roles) && this.userInfo.roles.includes('admin');
        },
        isSuperAdmin() {
            return Array.isArray(this.userInfo.roles) && this.userInfo.roles.includes('nbadmin');
        },
    },
}
</script>
<style lang='less' scoped>
.comp__container--absolute {
    width: 100%;
    height: 100%;

    .main__body {
        width: 90%;
        display: flex;
        margin: 12px;
        align-items: center;
        gap: 24px;

        .flex__container {
            width: 8em;
            height: 8em;
            flex-basis: 8em;
            flex-shrink: 0;
        }
    }
}

.one__line {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    .title {
        font-weight: bold;
    }

    margin:0.3rem;
}

.admin__blue {
    color: #4090EF;
    margin-left: 3px;
}
</style>
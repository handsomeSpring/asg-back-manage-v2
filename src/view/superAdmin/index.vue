<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="协助用户注册" name="1">
                <HelpEnroll v-if="activeName === '1'"></HelpEnroll>
            </el-tab-pane>
            <el-tab-pane label="管理员权限管理" name="2">
                <AdminManage></AdminManage>
            </el-tab-pane>
            <el-tab-pane label="QQ群消息发送" name="3">
                <qqSend></qqSend>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import HelpEnroll from './components/HelpEnroll.vue';
import AdminManage from './components/AdminManage.vue';
import qqSend from './components/qqSend.vue';
export default {
    name: 'superAdmin',
    components:{
        HelpEnroll,
        AdminManage,
        qqSend
    },
    data() {
        return {
            activeName:'1',
        };
    }
}
</script>
<style lang='less' scoped></style>
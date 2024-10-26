<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="协助用户注册" name="1">
                <HelpEnroll v-if="activeName === '1'"></HelpEnroll>
            </el-tab-pane>
            <el-tab-pane label="短信发送" name="2">发送信息</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import HelpEnroll from './components/HelpEnroll.vue';
export default {
    name: 'superAdmin',
    components:{
        HelpEnroll
    },
    data() {
        return {
            activeName:'1'
        };
    }
}
</script>
<style lang='less' scoped></style>
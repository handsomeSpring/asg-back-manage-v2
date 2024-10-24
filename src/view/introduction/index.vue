<template>
    <div class="introduction__container">
        <AsgStatus></AsgStatus>
        <div class="content_tag">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="审批核销" name="first">
                    <AsgVerifyPage></AsgVerifyPage>
                </el-tab-pane>
                <el-tab-pane disabled label="发布管理" name="second"></el-tab-pane>
                <el-tab-pane disabled label="赛事管理" name="third"></el-tab-pane>
            </el-tabs>
            <div class="position-right--btn">
                <el-button size="small" type="primary" icon="el-icon-s-custom"
                    @click="nbadminDialogVisible = true">超管列表</el-button>
                <el-button size="small" type="primary" icon="el-icon-s-custom" @click="adminDialogVisible = true"
                    style="margin-right: 10px;">管理列表</el-button>
            </div>
        </div>
        <AdminList :visible.sync="adminDialogVisible"></AdminList>
        <AdminList :visible.sync="nbadminDialogVisible" adminType="nbadmin"></AdminList>
    </div>
</template>

<script>
import AsgStatus from './components/AsgStatus.vue';
import AsgVerifyPage from './components/AsgVerifyPage.vue';
import AdminList from "@/components/AdminList.vue";
export default {
    name: 'AsgIntroduction',
    components: {
        AsgStatus,
        AsgVerifyPage,
        AdminList
    },
    data() {
        return {
            activeName: 'first',
            adminDialogVisible: false,
            nbadminDialogVisible: false,
        };
    },
    methods: {

    },
    created() {

    },
}
</script>
<style lang='less' scoped>
.introduction__container {
    margin-top: 32px;
}
.content_tag{
    position: relative;
    .position-right--btn{
        position: absolute;
        right: 0;
        top:0
    }
}
</style>
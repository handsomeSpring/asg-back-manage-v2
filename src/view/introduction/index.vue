<template>
  <div class="introduction__container asg-table-main">
    <AsgHighSearch showOperation>
      <template #top>
        <el-tabs v-model="activeName" type="card" size="small">
          <el-tab-pane label="审批核销" name="first"> </el-tab-pane>
          <el-tab-pane label="赛程全流程一栏表" name="second"> </el-tab-pane>
          <el-tab-pane disabled label="赛事管理" name="third"></el-tab-pane>
        </el-tabs>
      </template>
      <template #search>
        <AsgStatus></AsgStatus>
      </template>
      <template #operation>
          <el-button
            size="small"
            type="primary"
            icon="el-icon-s-custom"
            @click="nbadminDialogVisible = true"
            >超管列表</el-button
          >
          <el-button
            size="small"
            type="primary"
            icon="el-icon-s-custom"
            @click="adminDialogVisible = true"
            style="margin-right: 10px"
            >管理列表</el-button
          >
      </template>
    </AsgHighSearch>
    <AsgVerifyPage v-show="activeName === 'first'"></AsgVerifyPage>
    <allFlowSeason v-show="activeName === 'second'"></allFlowSeason>
    <AdminList :visible.sync="adminDialogVisible"></AdminList>
    <AdminList
      :visible.sync="nbadminDialogVisible"
      adminType="nbadmin"
    ></AdminList>
  </div>
</template>

<script>
import AsgStatus from "./components/AsgStatus.vue";
import AsgVerifyPage from "./components/AsgVerifyPage.vue"; //审批核销
import allFlowSeason from "./components/allFlowSeason.vue";
import AdminList from "@/components/AdminList.vue";
import AsgHighSearch from "@/components/AsgHighSearch.vue";
export default {
  name: "AsgIntroduction",
  components: {
    AsgStatus,
    AsgVerifyPage,
    AdminList,
    allFlowSeason,
    AsgHighSearch,
  },
  data() {
    return {
      activeName: "first",
      adminDialogVisible: false,
      nbadminDialogVisible: false,
    };
  },
  methods: {},
  created() {
    if (this.$route?.query?.tab) {
      this.activeName = this.$route?.query?.tab ?? "first";
    }
  },
};
</script>
<style lang="less" scoped>

/deep/.el-tabs__header{
  margin:0 !important;
}
</style>

<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane name="1">
        <span slot="label"><i class="el-icon-user-solid"></i> 官网用户管理</span>
        <suvivors v-if="activeName === '1'"></suvivors>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span slot="label">
          <i class="el-icon-video-camera-solid"></i> 解说人员管理<i @click="refreshList" style="margin-left:12px;cursor:pointer" class="el-icon-refresh-right"></i>
        </span>
        <commentator ref="commentator"></commentator>
      </el-tab-pane>
      <el-tab-pane name="3">
        <span slot="label">
          <i class="el-icon-message-solid"></i> 裁判人员管理
        </span>
        <judgetManage ref="judge"></judgetManage>
      </el-tab-pane>
      <el-tab-pane name="4">
        <span slot="label">
          <i class="el-icon-s-platform"></i> 导播人员管理
        </span>
        <anchorManage ref="Anchor"></anchorManage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name:'user-manager',
  components: {
    commentator: () => import('./components/commentator.vue'),
    suvivors: () => import('./components/suvivors.vue'),
    judgetManage: () => import('./components/judgetManage.vue'),
    anchorManage: ()=> import('./components/AnchorManage.vue')
  },
  data() {
    return {
      activeName: '1'
    }
  },
  methods:{
    refreshList(){
      this.$refs?.commentator && this.$refs.commentator.initGetCommentary();
    }
  }
}
</script>

<style scoped lang="less"></style>

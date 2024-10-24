<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane name="1">
        <span slot="label"><i class="el-icon-user-solid"></i> 官网用户管理</span>
        <suvivors v-if="activeName === '1'"></suvivors>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span slot="label"><i class="el-icon-video-camera-solid"></i> 解说人员管理</span>
        <commentator></commentator>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name:'user-manager',
  components: {
    commentator: () => import('./components/commentator.vue'),
    suvivors: () => import('./components/suvivors.vue')
  },
  data() {
    return {
      activeName: '1'
    }
  }
}
</script>

<style scoped lang="less"></style>

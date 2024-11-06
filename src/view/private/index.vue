<template>
  <div>
    <v-md-editor v-model="rule" height="500px"></v-md-editor>
    <div class="btn_wrap">
      <el-button type="primary" size="small" plain @click="publish"
        >发布隐私政策</el-button
      >
    </div>
  </div>
</template>

<script>
import { pushPrivatePolice } from "@/api/admin/index";
export default {
  name: "Private",
  data() {
    return {
      rule: "",
    };
  },
  methods: {
    async publish() {
      const { data } = await pushPrivatePolice(this.rule);
      if (data) {
        this.$message.success(data);
        this.rule = "";
      } else {
        this.$message.error("服务器错误，请重新尝试！");
      }
    },
  },
};
</script>

<style scoped lang="less">
.btn_wrap {
  text-align: center;
  margin: 12px auto;
}
</style>

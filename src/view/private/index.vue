<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="发布隐私策略" name="second"></el-tab-pane>
      <el-tab-pane label="机器人公告" name="third"></el-tab-pane>
    </el-tabs>
    <template v-if="activeName === 'second'">
      <v-md-editor v-model="rule" height="500px"></v-md-editor>
    <div class="btn_wrap">
      <el-button type="primary" size="small" plain @click="publish"
        >发布隐私政策</el-button
      >
    </div>
    </template>
    <template v-if="activeName ==='third'">
      <bot></bot>
    </template>
  </div>
</template>

<script>
import { pushPrivatePolice } from "@/api/admin/index";
import bot from "./components/bot"
export default {
  name: "Private",
  components:{
    sendE,
    bot
  },
  data() {
    return {
      rule: "",
      activeName:"first",
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
    }
  },
};
</script>

<style scoped lang="less">
.btn_wrap {
  text-align: center;
  margin: 12px auto;
}
</style>

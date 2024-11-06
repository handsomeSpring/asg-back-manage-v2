<template>
  <el-dialog
    :visible="visible"
    title="取消选班理由"
    width="30%"
    @close="handleClose"
  >
    <el-input size="small" v-model="reason" placeholder="请输入理由"></el-input>
    <span slot="footer">
      <el-button type="primary" size="small" @click="cancelGame"
        >取消选班</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "cancelDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    scheduleItems: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      reason: "",
    };
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  methods: {
    cancelGame() {
      if (!this.reason) {
        return this.$message.error("请输入取消选班理由！");
      }
      //   调用后端接口
      this.handleClose();
      this.$emit("finish");
    },
    handleClose() {
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>

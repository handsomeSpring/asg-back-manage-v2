<template>
  <el-dialog :visible="visible" title="取消选班理由" width="30%" @close="handleClose">
    <el-input size="small" v-model="reason" placeholder="请输入理由"></el-input>
    <span slot="footer">
      <el-button type="primary" size="small" @click="cancelGame">取消选班</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { cancelGame } from '@/api/schedule/referee.js';
export default {
  name: "cancelDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    scheduleItem: {
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
    async cancelGame() {
      try {
        if (!this.reason) {
          return this.$message.error("请输入取消选班理由！");
        }
        const { status } = await cancelGame(this.scheduleItem.id,this.reason);
        if (status !== 200) throw new Error('服务端异常！');
        this.handleClose();
        this.$emit("finish");
      } catch (error) {
        this.$message.error(error.message);
      }

    },
    handleClose() {
      this.visible = false;
    },
  },
};
</script>

<style scoped lang="scss"></style>

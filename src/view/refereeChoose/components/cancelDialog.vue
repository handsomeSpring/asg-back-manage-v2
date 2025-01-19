<template>
  <el-dialog :visible="visible" :close-on-click-modal="false" title="取消选班理由" :width="isMobile ? '100%' : '30%'" @close="handleClose">
    <el-input type="textarea" :rows="3" placeholder="请输入理由" v-model="reason" maxlength="20" show-word-limit>
    </el-input>
    <span slot="footer">
      <el-button type="primary" size="small" @click="cancelGame">确定取消选班</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { cancelGame } from '@/api/schedule/referee.js';
import { isMobile } from '@/utils';
export default {
  name: "cancelDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    scheduleItem: {
      type: Object,
      default: () => { },
    },
  },
  data() {
    return {
      reason: "",
      isMobile:false
    };
  },
  created(){
    this.isMobile = isMobile();
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
      if (!this.reason) {
        return this.$message.error("请输入取消选班理由！");
      }
      const loading = this.$loading({
        lock: true,
        text: "取消选班中......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        const { status } = await cancelGame(this.scheduleItem.id, this.reason);
        if (status !== 200) throw new Error('服务端异常！');
        this.$emit("finish");
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        loading.close();
        this.handleClose();
      }

    },
    handleClose() {
      this.visible = false;
      this.reason = '';
    },
  },
};
</script>

<style scoped lang="scss"></style>

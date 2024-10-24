<template>
  <div>
    <el-dialog :append-to-body="true" :visible="treeNode" title="选择合作类型" style="width: 50%;margin-left:25%"
      @close="close">
      <el-input size="small" placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree :data="data" show-checkbox node-key="id" accordion ref="tree" :filter-node-method="filterNode"
        @check="handleNodeClick">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="save" size="small">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getByTitle } from '@/api/config';
export default {
  name: "TreeNode",
  props: {
    treeNode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: [],
      filterText: '',
      saveNodes: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    getByTitle('coperationType').then(res => {
      this.data = res.data;
    })
  },
  methods: {
    close() {
      this.$emit("update:treeNode", false);
    },
    handleNodeClick(check, checkRow) {
      this.saveNodes = checkRow.checkedNodes;
    },
    save() {
      if(this.saveNodes.length > 3){
        return this.$message.warning('最多只能设置三个标签!');
      }
      const map = this.saveNodes.map(item => item.label);
      const stringJoin = map.join(',');
      this.$emit('save', stringJoin);
      this.close();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>

<style scoped lang="less">
.dialog-footer {
  text-align: center;
}
</style>

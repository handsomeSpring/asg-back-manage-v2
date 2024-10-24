<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="treeNode"
      title="选择合作类型"
      style="width: 50%;margin-left:25%"
      @close="close"
    >
      <el-input size="small" placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        accordion
        ref="tree"
        :filter-node-method="filterNode"
        @check="handleNodeClick"
      >
      </el-tree>
      <div slot="footer" class="dialog-footer">
      <el-button @click="save" size="small">保存</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
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
      data: [
        {
          id: 1,
          label: "视频合作",
          disabled: true,
          children: [
            {
              id: 2,
              label: "视频共创",
            },
            {
              id: 3,
              label: "视频互宣",
            },
            {
              id: 4,
              label: "协助宣发",
            },
          ],
        },
        {
          id: 5,
          label: "技术支持",
          disabled: true,
          children: [
            {
              id: 6,
              label: "软件设计",
            },
            {
              id: 7,
              label: "网站设计",
            },
            {
              id: 8,
              label: "BP软件开发",
            },
            {
              id: 9,
              label: "后端数据库",
            },
            {
              id: 10,
              label: "服务器运维",
            },
          ],
        },
        {
          id: 16,
          label: "赞助商",
          disabled: true,
          children: [
            {
              id: 11,
              label: "赞助解说",
            },
            {
              id: 12,
              label: "赞助官网",
            },
            {
              id: 13,
              label: "服务器赞助",
            },
            {
              id: 14,
              label: "导播赞助",
            },
            {
              id: 15,
              label: "赞助赛事组",
            },
          ],
        },
        {
          id: 17,
          label: "宣传",
          disabled: true,
          children: [
            {
              id: 18,
              label: "赛事宣传",
            },
            {
              id: 19,
              label: "赛事共办",
            },
            {
              id: 20,
              label: "赛规共创",
            },
            {
              id: 21,
              label: "线上线下联动",
            },
          ],
        },
      ],
      filterText: '',
      saveNodes:[],
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
  methods: {
    close() {
      this.$emit("update:treeNode", false);
    },
    handleNodeClick(check,checkRow) {
        this.saveNodes = checkRow.checkedNodes;
    },
    save(){
        const map = this.saveNodes.map(item=>item.label);
        const stringJoin = map.join(',');
        this.$emit('save',stringJoin);
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
.dialog-footer{
    text-align: center;
}
</style>

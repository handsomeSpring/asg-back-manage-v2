<template>
  <div class="grid__container">
    <el-card shadow="always" v-loading="loading" element-loading-text="系统加载中，请稍等"
      element-loading-spinner="el-icon-loading">
      <el-scrollbar style="height:70vh">
        <el-input style="width:90%" size="small" v-model="filterText" placeholder="请输入中文名搜索" clearable></el-input>
        <el-tree class="filter-tree" ref="tree" :data="allRoles" :props="defaultProps" accordion highlight-current
          :filter-node-method="filterNode" @node-click="nodeClick"></el-tree>
      </el-scrollbar>
    </el-card>
    <el-card class="info__container" shadow="hover">
      <template v-if="!!info.id">
        <header>
          <el-tag type="success">中文名：{{ info.label }}</el-tag>
          <el-tag type="info" style="margin-left:24px">用户ID：{{ info.id }}</el-tag>
        </header>
        <h2 class="title__info" style="--text:'任务清单管理'">
          <p class="title__before"></p>
        </h2>
        <el-tabs v-model="taskTab" tab-position="right">
          <el-tab-pane label="设置任务" name="setting">
            <setting-task v-if="taskTab === 'setting'" :user="info"></setting-task>
          </el-tab-pane>
          <el-tab-pane label="他的任务清单" name="view">
            <task-details v-if="taskTab === 'view'" :user="info"></task-details>
          </el-tab-pane>
        </el-tabs>
      </template>
      <template v-else>
        <el-empty description="未选择用户，点击左侧树状结构选择用户进行操作"></el-empty>
      </template>
    </el-card>
  </div>
</template>

<script>
import { getUsersWithRole } from "@/api/schedule/index";
import { filterRole } from '@/utils/filters.js';
import SettingTask from "./SettingTask.vue";
import TaskDetails from "./TaskDetails.vue";
import { getByTitle } from "@/api/config";
export default {
  name: "manager-page",
  components: {
    SettingTask,
    TaskDetails
  },
  data() {
    return {
      allRoles: [],
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      info: {},
      text: '',
      taskTab: 'setting',
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.init();
  },
  methods: {
    nodeClick(node) {
      if (node.disabled) return;
      this.info = node;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async init() {
      this.loading = true;
      const { data, status } = await getUsersWithRole();
      if (status !== 200) {
        this.allRoles = [];
        return;
      }
      const result = [];
      data.forEach(item => {
        const itemList = {
          label: filterRole(item[0].officium),
          id: item[0].officium,
          disabled: true,
          children: []
        }
        item.forEach(child => {
          itemList.children.push({
            id: child.id,
            label: child.chinaname
          })
        })
        result.push(itemList);
      });
      this.allRoles = result;
      this.loading = false;
    }
  }
};
</script>

<style scoped lang="less">
.grid__container {
  display: grid;
  gap: 24px;
  grid-template-columns: 25vw auto;
}


.info-container {
  header {
    display: flex;
    justify-content: flex-start;
    gap: 24px;
  }
}

.title__info {
  margin: 12px 0;
  display: flex;
  align-items: center;

  .title__before {
    width: 5px;
    height: 1rem;
    background: #4090EF;
    margin-right: 12px;
  }

  &::after {
    content: var(--text);
    font-size: 1rem;
  }
}
</style>

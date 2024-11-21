<template>
  <div class="asg-table-main">
    <el-container>
      <el-header class="my_header">
        <div class="left-box">办赛激励任务分配一览</div>
        <el-button type="primary" @click="drawer = true" size="small"
          >查看工作
        </el-button>
      </el-header>
      <el-main>
        <el-tabs tab-position="left" style="height: 200px">
          <el-tab-pane label="排班流程">
            <FirstCur></FirstCur>
          </el-tab-pane>
          <el-tab-pane label="业务审批流程">
            <SecondCur></SecondCur>
          </el-tab-pane>
          <el-tab-pane label="赛事组众投">
            <ThirdCur></ThirdCur>
          </el-tab-pane>
          <el-tab-pane label="奖金分配">
            <FouthCur></FouthCur>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <el-drawer
        custom-class="drawer-wrap"
        title="职责一览"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="handleClose"
      >
        <el-descriptions
          class="margin-top"
          :title="item.label"
          :column="2"
          size="medium"
          border
          v-for="item in details"
          :key="item.name"
        >
          <template slot="extra">
            <div style="margin-right: 10px">
              <el-tag v-if="item.sex === '0'" type="danger">女</el-tag>
              <el-tag v-else>男</el-tag>
            </div>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              用户名
            </template>
            {{ item.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-monitor"></i>
              职位
            </template>
            {{ item.role }}
          </el-descriptions-item>
          <el-descriptions-item :label-style="labelS">
            <template slot="label">
              <i class="el-icon-tickets"></i>
              详细介绍
            </template>
            {{ item.remark || "暂无介绍" }}
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>
    </el-container>
  </div>
</template>

<script>
import { getByTitle } from "@/api/config";
import FirstCur from "./components/FirstCur";
import SecondCur from "./components/SecondCur.vue";
import ThirdCur from "./components/ThirdCur.vue";
import FouthCur from "./components/FouthCur.vue";

export default {
  name: "Workflow",
  components: {
    FirstCur,
    SecondCur,
    ThirdCur,
    FouthCur,
  },
  data() {
    return {
      drawer: false,
      details: [],
      labelS: {
        "min-width": "100px",
      },
    };
  },
  methods: {
    handleClose() {
      this.drawer = false;
    },
  },
  mounted() {
    getByTitle("orgConfig")
      .then((res) => {
        const data = res.data.filter((item) => item.code !== "waitAssign");
        this.details = [];
        for (const parent of data) {
          for (const child of parent.data) {
            this.details.push({
              label: parent.label,
              ...child,
            });
          }
        }
      })
      .catch((err) => {
        this.$message.error("获取云端配置失败！");
      });
  },
};
</script>
<style lang="less">
.drawer-wrap {
  padding: 20px;
}
</style>
<style scoped lang="less">
.my_header {
  background-color: #F2F6FD;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  .left-box {
    background: linear-gradient(141deg, #44a3fd 0%, #0c80e5 100%);
    border-radius: 6px;
    padding:6px 12px;
    color:#fff;
    font-size: 14px;
    font-weight: 500;
  }
}
.margin-top {
  margin-bottom: 10px;
}
.el-description-item {
  width: 50%;
}
/deep/.el-tabs--left,
.el-tabs--right {
  height: 500px !important;
  overflow-y: auto;
}
</style>

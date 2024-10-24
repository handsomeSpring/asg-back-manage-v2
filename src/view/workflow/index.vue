<template>
  <div>
    <el-container>
      <el-header style="height: 40px">
        <el-button type="primary" @click="drawer = true" size="mini"
          >查看工作<i class="el-icon-menu"></i
        ></el-button>
      </el-header>
      <el-main>
        <el-tag size="small"
          ><i class="el-icon-share"></i>办赛流程（工作流）一键预览</el-tag
        >
        <el-tabs tab-position="left" style="height: 200px">
          <el-tab-pane label="排班流程">
            <FirstCur></FirstCur>
          </el-tab-pane>
          <el-tab-pane label="赛季发布流程">
            <SecondCur></SecondCur>
          </el-tab-pane>
          <el-tab-pane label="赛事组决议">
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
          title="赛事组成员信息"
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
            {{ item.details }}
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
    getByTitle("userRole")
      .then((res) => {
        this.details = res.data;
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
.el-header {
  background-color: #aec9eb;
  color: #333;
  text-align: right;
  line-height: 40px;
}
.el-tag {
  margin-bottom: 10px;
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

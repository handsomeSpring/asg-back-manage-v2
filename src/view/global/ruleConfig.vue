<template>
  <div class="rule__config--grid">
    <div class="left_tabs">
      <li class="header__tabs items">流程规则</li>
      <li
        class="items item-children"
        :class="bizType === item.bizType ? 'active' : ''"
        v-for="item in tabs"
        :key="item.bizType"
        @click="handleChooseBizType(item)"
      >
        {{ item.label }}
      </li>
    </div>
    <el-card shadow="hover">
      <template #header>
        <div class="biz__header">
          <p>{{ bizName }}</p>
          <div class="operation--ops">
            <el-button type="primary" size="small" @click="addNewNode"
              >新增节点</el-button
            >
          </div>
        </div>
      </template>
      <div class="main-body" v-if="bizType">
        <div class="start__btn">开始</div>
        <div
          class="process__item"
          v-for="(item, index) in processInfo"
          @click="openDialog(item)"
          :key="index"
        >
          <div class="title">
            <i style="margin-right:3px" class="el-icon-s-custom"></i>
            {{ item.chinaname || "未配置" }}
          </div>
          <div class="operation__box">
            <p>{{ item.isAllowReturn === "1" ? "允许退回" : "不允许退回" }}</p>
          </div>
        </div>
        <div class="end__btn">
          <div class="circle__list"></div>
          <p>流程结束</p>
        </div>
      </div>
      <el-empty description="未选择业务" v-else></el-empty>
    </el-card>
    <roleChooseDialog :dialogVisible="dialogVisible" :personInfo="personInfo"></roleChooseDialog>
  </div>
</template>

<script>
import { getByTitle } from "@/api/config";
import roleChooseDialog from './components/roleChooseDialog.vue';

export default {
  name: "ruleConfig",
  components:{
    roleChooseDialog
  },
  data() {
    return {
      tabs: [],
      bizType: "",
      processInfo: [],
      dialogVisible:false,
      personInfo:{}
    };
  },
  computed: {
    bizName() {
      return (
        this.tabs.find((item) => item.bizType === this.bizType)?.label ??
        "未选择业务"
      );
    },
  },
  methods: {
    openDialog(item){
      this.dialogVisible = true;
      this.personInfo = item;
    },
    handleChooseBizType(item) {
      this.bizType = item.bizType;
      this.processInfo = item.process;
    },
    addNewNode() {
      this.processInfo.push({
        userId: "",
        chinaname: "",
        isAllowReturn: "0",
      });
    },
  },
  created() {
    getByTitle("ruleConfig").then((res) => {
      this.tabs = res.data;
      console.log(this.tabs, "tabs");
    });
  },
};
</script>

<style scoped lang="less">
.rule__config--grid {
  display: grid;
  grid-template-columns: 246px auto;
  gap: 12px;
  .left_tabs {
    .items {
      display: flex;
      align-items: center;
      height: 50px;
      padding-left: 25px;
      &.item-children {
        color: #252527;
        cursor: pointer;
        &:hover {
          background: rgba(26, 107, 241, 0.08);
          color: #1a6bf1;
        }
        &.active {
          background: rgba(26, 107, 241, 0.08);
          color: #1a6bf1;
        }
      }
    }
    .header__tabs {
      background: linear-gradient(90deg, #77a2f3 0%, #1891fd 47%, #145bcf 100%);
      color: #fff;
      font-size: 18px;
      font-weight: 500;
    }
  }
  // card头部
  .biz__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .main-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .start__btn {
      padding: 4px 12px;
      width: 120px;
      background: #40a9ff;
      text-align: center;
      color: #fff;
      overflow: hidden;
      border-radius: 4px;
      margin-bottom: 36px;
    }
    .end__btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .circle__list {
        background: #cdcdcd;
        border-radius: 50%;
        height: 15px;
        width: 15px;
      }
      p {
        font-size: 12px;
        color: #cdcdcd;
      }
    }
    .process__item {
      display: flex;
      flex-direction: column;
      width: 220px;
      flex-shrink: 0;
      background: #fff;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
      margin-bottom: 36px;
      box-sizing: border-box;
      border: 1px solid transparent;
      &:hover {
        border-color: #40a9ff;
      }
      .title {
        color: #fff;
        padding: 3px 12px;
        font-size: 13px;
        font-weight: 500;
        background: rgb(255, 148, 62);
        border-radius: 4px 4px 0 0;
      }
      .operation__box {
        font-size: 14px;
        padding: 14px 12px;
      }
    }
  }
}
</style>

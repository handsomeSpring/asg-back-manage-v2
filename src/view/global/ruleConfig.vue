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
        <p>{{ item.label }}</p>
        <div @click.stop="handleDelete(item)">
          <svg-icon iconClass="deleteBash" color="#f40"></svg-icon>
        </div>
      </li>
      <li class="items addBtn" @click="addNewFlow">
        <p>新增审批流程</p>
        <i class="el-icon-plus"></i>
      </li>
    </div>
    <el-card shadow="hover">
      <template #header>
        <div class="biz__header">
          <p>{{ bizName }}</p>
          <div class="operation--ops">
            <el-button
              v-if="bizType"
              type="primary"
              size="small"
              @click="addNewNode"
              >新增节点</el-button
            >
            <el-button
              type="primary"
              size="small"
              :loading="loading"
              @click="handleSave"
              >保存规则</el-button
            >
          </div>
        </div>
      </template>
      <div class="main-body" id="efContainer" v-show="bizType">
        <div class="start__btn" id="start">
          <svg-icon iconClass="startPerson" width="25px" height="25px"></svg-icon>
          <p>发起人</p>
          <div class="line"></div>
        </div>
        <div
          class="process__item"
          v-for="(item, index) in processInfo"
          @click="openDialog(item, index)"
          :key="index"
        >
          <div class="title">
            <p>
              <i style="margin-right: 3px" class="el-icon-s-custom"></i>
              {{ item.chinaname || "未配置" }}
            </p>
            <i class="el-icon-close icon" @click.stop="closeNode(index)"></i>
          </div>
          <div class="operation__box">
            <p>{{ item.isAllowReturn === "1" ? "允许退回" : "不允许退回" }}</p>
          </div>
          <div class="line"></div>
          <div class="return--pointer" v-if="item.isAllowReturn === '1'"></div>
        </div>
        <div class="end__btn" id="end">
          <div class="circle__list"></div>
          <p>流程结束（办结）</p>
        </div>
      </div>
      <el-empty description="未选择业务" v-show="!bizType"></el-empty>
    </el-card>
    <roleChooseDialog
      :dialogVisible.sync="dialogVisible"
      :personInfo="personInfo"
      @finish="handleChoose"
    >
    </roleChooseDialog>
    <el-dialog
      :visible.sync="newDialog"
      title="新增业务"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-input
        style="margin: 12px 0"
        v-model="newForm.label"
        size="small"
        placeholder="请输入业务名称"
      ></el-input>
      <el-input
        v-model="newForm.bizType"
        size="small"
        placeholder="请输入业务编码"
      ></el-input>
      <span slot="footer">
        <el-button @click="addNewBizType" size="small" type="primary"
          >新增业务</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getByTitle, addConfig } from "@/api/config";
import roleChooseDialog from "./components/roleChooseDialog.vue";

export default {
  name: "ruleConfig",
  components: {
    roleChooseDialog,
  },
  data() {
    return {
      tabs: [],
      bizType: "",
      processInfo: [],
      dialogVisible: false,
      personInfo: {},
      tableIndex: null,
      loading: false,
      newDialog: false,
      newForm: {
        label: "",
        bizType: "",
        process: [],
      },
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
    // 删除业务流程
    async handleDelete(item) {
      try {
        const result = await this.$confirm(
          `您确定删除${item.label}业务流程吗？`,
          "确定",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (result !== "confirm") return;
        const index = this.tabs.findIndex(
          (tab) => tab.bizType === item.bizType
        );
        if (index === -1) throw new Error("未找到下标");
        this.tabs.splice(index, 1);
        const req = {
          id: 327,
          msg: "审批规则配置",
          substance: JSON.stringify(this.tabs),
          title: "ruleConfig",
        };
        const { status } = await addConfig(req);
        if (status !== 200) throw new Error("服务端异常");
        this.$message.success("删除成功！");
        this.bizType = "";
        this.processInfo = [];
      } catch (error) {
        if (typeof error === "string" && error === "cancel") return;
        this.$message.error(error.message);
      }
    },
    async addNewBizType() {
      try {
        if (!this.newForm.label || !this.newForm.bizType)
          throw new Error("请完整填写表单！");
        const bizTypes = this.tabs.map((item) => item.bizType);
        if (bizTypes.includes(this.newForm.bizType))
          throw new Error("业务编码重复！");
        this.tabs.push(this.newForm);
        const req = {
          id: 327,
          msg: "审批规则配置",
          substance: JSON.stringify(this.tabs),
          title: "ruleConfig",
        };
        const { status } = await addConfig(req);
        if (status !== 200) throw new Error("服务端异常");
        this.$message.success("新增成功！");
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.newDialog = false;
        this.newForm = {
          label: "",
          bizType: "",
          process: [],
        };
      }
    },
    addNewFlow() {
      this.newDialog = true;
    },
    async handleSave() {
      try {
        this.loading = true;
        const bizObj = this.tabs.find((item) => item.bizType === this.bizType);
        bizObj.process = this.processInfo;
        const processId = this.processInfo.map((tab) => tab.id);
        const uniBeforeLength = processId.length;
        const uniAfterLength = Array.from(new Set(processId)).length;
        if (uniBeforeLength !== uniAfterLength)
          return this.$message.error("流程中不能出现相同的节点！");
        if (this.processInfo.length === 0)
          return this.$message.error("至少配置一个节点！");
        const flag = this.processInfo.every((item) => !!item.id);
        if (!flag)
          return this.$message.error("存在某个节点没有配置人员，请检查！");
        const req = {
          id: 327,
          msg: "审批规则配置",
          substance: JSON.stringify(this.tabs),
          title: "ruleConfig",
        };
        const { status } = await addConfig(req);
        if (status !== 200) throw new Error("服务端异常");
        this.$message.success("保存成功！");
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    handleChoose(obj) {
      this.processInfo[this.tableIndex] = obj;
      this.dialogVisible = false;
    },
    openDialog(item, index) {
      this.dialogVisible = true;
      this.personInfo = item;
      this.tableIndex = index;
    },
    handleChooseBizType(item) {
      this.bizType = item.bizType;
      this.processInfo = item.process;
    },
    addNewNode() {
      this.processInfo.push({
        id: "",
        chinaname: "",
        isAllowReturn: "0",
      });
    },
    closeNode(index) {
      this.processInfo.splice(index, 1);
    },
  },
  created() {
    getByTitle("ruleConfig").then((res) => {
      this.tabs = res.data;
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
      justify-content: space-between;
      height: 50px;
      padding: 0 25px;
      &.addBtn {
        border-radius: 10px;
        margin: 12px 0;
        border: 1px dashed #e7e7e7;
        cursor: pointer;
        height: 40px;
        background: rgba(26, 107, 241, 0.08);
      }

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
    font-family: 'hk';
  }

  .main-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .start__btn {
      padding: 6px 12px;
      width: 120px;
      background: #40a9ff;
      text-align: center;
      color: #fff;
      border-radius: 6px;
      margin-bottom: 36px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap:4px;
      p{
        font-size: 14px;
        font-family: 'hk';
      }

      .line {
        position: absolute;
        left: 50%;
        bottom: -34px;
        transform: translate(-50%);
        width: 2px;
        height: 32px;
        background: #d7d7d7;
      }
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
        font-family: 'hk';
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
      position: relative;

      &:hover {
        border-color: #40a9ff;
      }

      .line {
        position: absolute;
        position: absolute;
        left: 50%;
        bottom: -36px;
        transform: translate(-50%);
        width: 2px;
        height: 32px;
        background: #d7d7d7;
      }

      .return--pointer {
        left: -100px;
        height: 50px;
        width: 50px;
        top: 50%;
        transform: translate(0, -50%);
        background: #f40;
        position: absolute;
        -webkit-clip-path: polygon(
          40% 0%,
          40% 20%,
          100% 20%,
          100% 80%,
          40% 80%,
          40% 100%,
          0% 50%
        );
        clip-path: polygon(
          40% 0%,
          40% 20%,
          100% 20%,
          100% 80%,
          40% 80%,
          40% 100%,
          0% 50%
        );
      }

      .title {
        color: #fff;
        padding: 3px 12px;
        font-size: 13px;
        font-weight: 500;
        background: rgb(255, 148, 62);
        border-radius: 4px 4px 0 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .operation__box {
        font-size: 14px;
        padding: 14px 12px;
      }
    }
  }
}
.icon {
  color: #fff;
  &:hover {
    color: #f40;
  }
}
</style>

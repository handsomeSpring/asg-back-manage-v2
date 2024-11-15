<template>
  <div class="drag__container">
    <div class="toAssigned--left">
      <div class="operation__content">
        <p>待分配人员</p>
        <el-button
          size="small"
          type="primary"
          @click.prevent="handleOpen('add', {}, -1, $event)"
          >新增成员</el-button
        >
      </div>
      <draggable
        class="content"
        v-model="waitAssign"
        :options="{
          group: { name: 'orgPerson', put: true, pull: true },
          sort: false,
        }"
      >
        <li
          class="drag__item"
          v-for="(item, index) in waitAssign"
          :key="item.name"
          @click="handleOpen('edit', item, index, $event)"
        >
          <header>
            <p>{{ item.name }}</p>
          </header>
          <main>
            <div class="body">
              <p class="sex">{{ item.sex === "1" ? "男" : "女" }}</p>
              <div class="role">
                <p class="role_name">{{ item.role }}</p>
              </div>
            </div>
          </main>
        </li>
      </draggable>
    </div>
    <div class="some_org">
      <div class="header_operation">
        <el-button type="primary" size="small" @click="dialogVisible = true"
          >新增区域</el-button
        >
        <el-button type="success" size="small" @click="handleSave"
          >保存</el-button
        >
      </div>
      <div class="main_grid">
        <div
          class="some__item--grid"
          v-for="item in layoutConfig"
          :key="item.code"
        >
          <div class="label">
            <p>{{ item.label }}</p>
          </div>
          <draggable
            class="content"
            v-model="item.data"
            :options="{
              group: { name: 'orgPerson', put: true, pull: true },
              sort: false,
            }"
          >
            <li class="drag__item" v-for="item in item.data" :key="item.name">
              <header>
                <p>{{ item.name }}</p>
              </header>
              <main>
                <div class="body">
                  <p class="sex">{{ item.sex === "1" ? "男" : "女" }}</p>
                  <div class="role">
                    <p class="role_name">{{ item.role }}</p>
                  </div>
                </div>
              </main>
            </li>
          </draggable>
        </div>
      </div>
    </div>
    <personInfoDialog
      ref="personInfoDialog"
      @finish="handleFinish"
    ></personInfoDialog>
    <!-- 新增区域弹窗 -->
    <el-dialog title="区域新增" width="30%" :visible.sync="dialogVisible">
      <el-form
        ref="blockForm"
        :model="form"
        label-position="right"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="区域编码" prop="code">
          <el-input size="small" v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="区域名称" prop="label">
          <el-input size="small" v-model="form.label"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="addBlock"
          >保存</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getByTitle, addConfig } from "@/api/config";
import draggable from "vuedraggable";
import personInfoDialog from "./components/personInfoDialog.vue";
import { deepClone } from "@/utils";
export default {
  name: "orgManage",
  components: {
    draggable,
    personInfoDialog,
  },
  data() {
    return {
      waitAssign: [],
      layoutConfig: {},
      dialogVisible: false,
      groupOptions: {
        name: "orgPerson",
        pull: true,
        put: true,
      },
      dragOptions: {
        animation: 120,
        scroll: true,
        group: "sortlist",
        ghostClass: "ghost-style",
      },
      form: {
        label: "",
        code: "",
      },
      rules: {
        code: [
          {
            required: true,
            message: "请填写编码",
            trigger: "blur",
          },
        ],
        label: [
          {
            required: true,
            message: "请填写标签",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.initLayout();
  },
  methods: {
    handleSave() {
      const saveData = [
        {
          code: "waitAssign",
          label: "待分配区域",
          data: this.waitAssign,
        },
        ...this.layoutConfig,
      ];
      const param = {
        id: 349,
        msg: "组织机构管理",
        substance: JSON.stringify(saveData),
        title: "orgConfig",
      };
      addConfig(param).then(() => {
        this.$message.success("保存成功！");
      });
    },
    addBlock() {
      this.$refs.blockForm.validate((valid) => {
        if (valid) {
          this.layoutConfig.push({
            ...this.form,
            data: [],
          });
          this.dialogVisible = false;
        } else {
          this.$message.error("请填写表单！");
        }
      });
    },
    handleFinish(form, index) {
      if (index === -1) {
        this.waitAssign.push(deepClone(form));
      } else {
        this.$set(this.waitAssign, index, deepClone(form));
      }
    },
    handleOpen(type, row = {}, index) {
      this.$refs?.personInfoDialog?.openDialog(type, deepClone(row), index);
    },
    async initLayout() {
      try {
        const { status, data } = await getByTitle("orgConfig");
        if (status !== 200) throw new Error("服务端异常");
        this.layoutConfig = data;
        this.waitAssign =
          data.find((item) => item.code === "waitAssign")?.data ?? [];
        this.layoutConfig = data.filter((item) => item.code !== "waitAssign");
      } catch (error) {
        this.$message.error("orgConfig未找到:" + error.message);
      }
    },
  },
};
</script>

<style scoped lang="less">
.drag__container {
  display: grid;
  grid-template-columns: 300px auto;
  min-height: 70vh;
  border: 1px solid #e7e7e7;
  border-radius: 6px;

  .toAssigned--left {
    padding: 12px;
    border-right: 1px solid #e7e7e7;
  }

  .operation__content {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .some_org {
    padding: 12px;
    .header_operation {
      margin: 6px 0;
    }
    .main_grid {
      display: grid;
      grid-template-columns: 40% 40%;
      gap: 48px;
      .some__item--grid {
        padding: 12px;
        width: 100%;
        height: 400px;
        border: 1px solid #e7e7e7;
        border-radius: 6px;
        overflow: auto;
        .label {
          width: 100%;
          height: 40px;
          background: #f6f6f6;
          border-radius: 6px 6px 0 0;
          border-bottom: 1px solid #e8e8e8;
          display: flex;
          align-items: center;
          p {
            color: #0c80e5;
            font-weight: 500;
            font-size: 15px;
            margin-left: 12px;
          }
        }
      }
    }
  }
}

.content {
  height: 100%;
  width: 100%;
}

.drag__item {
  width: 213px;
  height: 79px;
  background: linear-gradient(180deg, #f0f3f6 0%, #ffffff 100%);
  box-shadow: 0px 2px 6px 0px rgba(220, 231, 241, 0.7);
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #ffffff;
  cursor: move;
  margin: 12px 0;

  header {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    P {
      font-weight: 500;
      font-size: 13px;
      color: #000000;
      line-height: 15px;
    }
  }

  main {
    padding: 0 12px;

    .body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      padding: 4px 6px;

      .sex {
        font-weight: 400;
        font-size: 12px;
        color: #8c8c8c;
        line-height: 14px;
      }

      .role {
        width: 66px;
        height: 18px;
        background: #ebf3fe;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px;
        .role_name {
          font-weight: 400;
          font-size: 10px;
          color: #0c80e5;
          line-height: 12px;
          text-align: left;
          font-style: normal;
          text-transform: none;
        }
      }
    }
  }
}
&::-webkit-scrollbar-track-piece {
  background: #d3dce6;
}
&::-webkit-scrollbar {
  width: 6px;
}
&::-webkit-scrollbar-thumb {
  background: #99a9bf;
  border-radius: 20px;
}
</style>

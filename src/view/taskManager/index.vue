<template>
  <div>
    <header>
      <div class="search__container">
        <p class="label">任务委托人</p>
        <el-input
          size="small"
          v-model="listQuery.chinaname"
          placeholder="请输入中文名"
          clearable
        ></el-input>
        <p style="margin-left: 12px" class="label">完成情况</p>
        <el-select
          size="small"
          v-model="listQuery.status"
          placeholder="请选择是否完成"
          clearable
        >
          <el-option label="全部" value=""></el-option>
          <el-option label="进行中" value="0"></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="已通过" value="2"></el-option>
          <el-option label="已驳回" value="3"></el-option>
        </el-select>
      </div>
      <div>
        <el-button size="small" type="primary" @click="initTask('check')"
          >查询</el-button
        >
        <el-button size="small" @click="initTask('reset')">重置</el-button>
      </div>
    </header>
    <main>
      <table
        v-loading="loading"
        element-loading-text="系统加载中，请稍等"
        element-loading-spinner="el-icon-loading"
      >
        <thead>
          <th width="10%">任务标题</th>
          <th width="42%">任务描述</th>
          <th width="8%">优先级</th>
          <th width="13%">任务执行者</th>
          <th width="10%">任务状态</th>
          <th width="17%">操作</th>
        </thead>
        <tbody>
          <template v-if="tableData.length > 0">
            <tr v-for="(item, index) in tableData" :key="index">
              <td width="150">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="item.taskName"
                  placement="top-start"
                >
                  <p class="ellipse">{{ item.taskName }}</p>
                </el-tooltip>
              </td>
              <td width="auto">
                <p class="multi__line">
                  {{ item.taskDescription }}
                </p>
              </td>
              <td align="center" width="120">
                <p :class="`level-${item.priority}`">
                  {{ item.priority | filterPriority }}
                </p>
              </td>
              <td align="center" width="120">{{ item.chinaname }}</td>
              <td align="center" width="120">
                <p class="my-task-info margin-icon" v-if="item.status === '0'">
                  <i class="el-icon-time"></i>进行中
                </p>
                <p
                  class="my-task-auth margin-icon"
                  v-else-if="item.status === '1'"
                >
                  <i class="el-icon-warning"></i>待审核
                </p>
                <p
                  class="my-task-success margin-icon"
                  v-else-if="item.status === '2'"
                >
                  <i class="el-icon-success"></i>已完成
                </p>
                <p
                  class="my-task-error margin-icon"
                  v-else-if="item.status === '3'"
                >
                  <i class="el-icon-error"></i>已驳回
                </p>
              </td>
              <td align="center" width="150">
                <template v-if="['0', '3'].includes(item.status)">
                  <el-button type="text" @click="handleEdit(item)"
                    >编辑</el-button
                  >
                  <el-button type="text" @click="handleNotice(item)"
                    >通知</el-button
                  >
                </template>
                <template v-if="item.status === '1'">
                  <el-button
                    type="text"
                    @click="handleTaskDone('通过', item, '2')"
                    >通过</el-button
                  >
                  <el-button
                    style="color: #f40"
                    type="text"
                    @click="handleTaskDone('驳回', item, '3')"
                    >驳回</el-button
                  >
                </template>
                <el-button type="text" @click="viewTask(item)">查看</el-button>
                <el-button
                  v-if="!['1', '2'].includes(item.status)"
                  style="color: #f40"
                  type="text"
                  @click="deleteTaskItem(item.id, item.createUserId)"
                  >删除</el-button
                >
              </td>
            </tr>
          </template>
          <template v-else>
            <tr align="center">
              <td width="20%" class="no__task" colspan="5">暂无任务</td>
            </tr>
          </template>
        </tbody>
      </table>

      <el-pagination
        style="margin-top: 18px; text-align: right"
        @size-change="handleChange($event, 'limit')"
        @current-change="handleChange($event, 'page')"
        :current-page="pageQuery.page"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </main>
    <el-dialog
      class="blue-text"
      title="编辑任务"
      :visible.sync="dialogVisible"
      width="50%"
      @close="resetForm"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editFormRef"
        label-position="right"
        label-width="100px"
      >
        <el-form-item class="blue-text" label="任务标题" prop="taskName">
          <el-input size="small" v-model="editForm.taskName"></el-input>
        </el-form-item>
        <el-form-item class="blue-text" label="任务描述" prop="taskDescription">
          <el-input
            size="small"
            type="textarea"
            v-model="editForm.taskDescription"
            :rows="5"
            placeholder="请输入任务描述"
            maxlength="200"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item class="blue-text" label="任务积分" prop="money">
          <el-input-number
            size="small"
            v-model="editForm.money"
            :min="0"
            :max="5"
          ></el-input-number>
        </el-form-item>
        <el-form-item class="blue-text" label="任务优先级" prop="money">
          <AsgPriorityComp :priority.sync="editForm.priority"></AsgPriorityComp>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看弹窗 -->
    <taskHistory ref="taskHistory" :row="row"></taskHistory>
  </div>
</template>

<script>
import {
  findTasks,
  deleteTask,
  taskDone,
  remindTasks,
  updateTaskApi,
} from "@/api/admin/index.js";
import taskHistory from "./components/taskHistory.vue";
import AsgPriorityComp from "@/components/AsgPriorityComp.vue";
import { mapGetters } from "vuex";

export default {
  name: "taskManager",
  components: {
    taskHistory,
    AsgPriorityComp,
  },
  data() {
    return {
      listQuery: {
        chinaname: "",
        status: "",
      },
      tableData: [],
      loading: false,
      pageQuery: {
        page: 1,
        limit: 10,
      },
      total: null,
      row: {},
      dialogVisible: false,
      editForm: {
        taskId: "",
        taskName: "",
        taskDescription: "",
        money: null,
      },
      rules: {
        taskName: [
          { required: true, message: "请输入任务标题", trigger: "blur" },
        ],
        taskDescription: [
          { required: true, message: "请输入任务描述", trigger: "blur" },
        ],
        money: [{ required: true, message: "请输入任务积分", trigger: "blur" }],
      },
    };
  },
  filters: {
    filterPriority(val) {
      const mapList = {
        0: "不急",
        1: "轻微",
        2: "一般",
        3: "紧需",
        4: "致命",
      };
      return mapList[val];
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    userName() {
      return (
        this.userInfo.chinaname ||
        sessionStorage.getItem("chinaname") ||
        "未知超管"
      );
    },
    userId() {
      return this.userInfo?.id || sessionStorage.getItem("id");
    },
  },
  created() {
    this.initTask();
  },
  methods: {
    async handleNotice(item) {
      // const qqNum = this.qqMap.find(el => el.userId === item.userId)?.qq;
      // if (!qqNum) return this.$message.error('该用户的qq没有绑定到全局参数<qqMap里>，请检查！');
      const loading = this.$loading({
        lock: true,
        text: "正在刷新数据中......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
      try {
        // const message = `<ASG机器人通知>尊敬的${item.chinaname}，请检查您的任务:"${item.taskName}" 是否完成，若完成，请上后台点击完成！`
        const { status } = await remindTasks(item.id);
        if (status !== 200) throw new Error("服务端异常！");
        this.$message.success("发送成功！");
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        loading.close();
      }
    },
    viewTask(item) {
      this.row = item;
      this.$refs.taskHistory.openDialog();
    },
    handleChange(value, prop) {
      this.pageQuery = {
        ...this.pageQuery,
        [prop]: value,
      };
      this.initTask();
    },
    async deleteTaskItem(id, createUserId) {
      try {
        if (Number(this.userId) !== Number(createUserId)) {
          return this.$message.error("您不能删除其他超管创建的任务");
        }
        const userChoose = await this.$confirm(
          `您是否确定删除该任务？, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (userChoose === "confirm") {
          await deleteTask(id);
          this.$message.success("删除成功！");
          this.initTask();
        }
      } catch (error) {
        if (typeof error === "string" && error === "cancel") return;
      }
    },
    async handleTaskDone(text, item, status) {
      try {
        const userChoose = await this.$confirm(
          `您是否确定${text}该任务？, 是否继续?`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
        if (userChoose === "confirm") {
          const requestData = {
            taskid: item.id,
            status,
            approvalPerson: this.userName,
          };
          await taskDone(requestData);
          this.initTask();
          this.$message.success("操作成功！");
        }
      } catch (error) {
        if (typeof error === "string" && error === "cancel") return;
        console.log(error, "error");
      }
    },
    async initTask(type) {
      try {
        if (!!type && type === "reset") {
          this.listQuery = {
            chinaname: "",
            status: "",
          };
        }
        if (!!type && type === "check") {
          this.pageQuery = {
            page: 1,
            limit: 10,
          };
        }
        this.loading = true;
        const requestBody = {
          ...this.listQuery,
          ...this.pageQuery,
        };
        const { data, status, message } = await findTasks(requestBody);
        if (status !== 200) throw new Error(message);
        if (data.code === 401) throw new Error(data.message);
        this.tableData = data.rows;
        this.total = data.total;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    handleEdit(item) {
      this.editForm = {
        taskId: item.id,
        taskName: item.taskName,
        taskDescription: item.taskDescription,
        money: item.money,
        priority: item.priority ?? "0",
      };
      this.dialogVisible = true;
    },
    resetForm() {
      this.$refs.editFormRef.resetFields();
    },
    async handleSubmit() {
      try {
        this.$refs.editFormRef.validate((valid) => {
          if (valid) {
            this.updateTask(this.editForm);
          }
        });
      } catch (error) {
        console.error(error);
        this.$message.error("更新失败");
      }
    },
    async updateTask(reqDTO) {
      try {
        const { status, data } = await updateTaskApi(reqDTO);
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员");
        if (data.code && data.code === 404)
          throw new Error(data?.message ?? "未知错误，请联系网站管理员！");
        if (data.code && data.code === 401)
          throw new Error(data?.message ?? "没有权限！");
        this.$message.success("操作成功!");
        this.dialogVisible = false;
        this.initTask();
      } catch (error) {
        this.$message.error(error instanceof Error ? error.message : error);
      }
    },
  },
};
</script>
<style lang="less" scoped>
@borderColor: #e9e9e8;
@bgColor: #f2f6fd;
@hoverBgColor: #e7f0ff;
@ContainerBgColor: #f2f2f2;
@textBlueColor: #4090ef;

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;

  padding: 12px 16px;
  border-radius: 3px;

  .search__container {
    display: grid;
    grid-template-columns: 100px auto 100px auto;
    align-items: center;

    .label {
      font-size: 0.9rem;
      font-weight: bold;
      color: #303030;
    }
  }
}

main {
  padding: 16px;
  border-radius: 5px;
  table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid @borderColor;

    thead {
      background: @bgColor;
      height: 50px;

      th {
        border: 1px solid @borderColor;
      }
    }

    tbody {
      tr {
        height: 50px;
        background-color: #fff;

        &:hover {
          background: @bgColor;
        }

        td {
          padding: 6px 12px;
          border: 1px solid @borderColor;
          cursor: pointer;

          .ellipse {
            width: inherit;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .multi__line {
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
      }
    }

    .no__task {
      font-size: 0.8rem;
      color: #717171;
      background: #fff;

      &:hover {
        background: @hoverBgColor;
      }
    }
  }
}

.blue-text ::v-deep .el-dialog__title,
.blue-text ::v-deep .el-form-item__label {
  color: @textBlueColor !important;
}
::v-deep .el-form-item__content {
  line-height: 20px;
  margin-top: 5px;
}
.level-0 {
  color: #cddc39;
}
.level-1 {
  color: #8bc34a;
}
.level-2 {
  color: #fdd835;
}
.level-3 {
  color: #ff8f00;
}
.level-4 {
  color: #c62828;
}
</style>

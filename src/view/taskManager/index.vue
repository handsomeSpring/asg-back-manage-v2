<template>
  <div>
    <AsgHighSearch>
      <template #top>
        <el-select size="small" v-model="listQuery.status" placeholder="请选择是否完成" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="进行中" value="0"></el-option>
          <el-option label="待审核" value="1"></el-option>
          <el-option label="已通过" value="2"></el-option>
          <el-option label="已驳回" value="3"></el-option>
        </el-select>
      </template>
      <template #btnList>
        <el-button size="small" type="primary" @click="initTask('check')">查询</el-button>
        <el-button size="small" @click="initTask('reset')">重置</el-button>
      </template>
      <template #search>
        <el-select size="small" v-model="listQuery.userId" placeholder="选择人员">
          <el-option label="全部" value=""></el-option>
          <el-option-group v-for="group in personList" :key="group.label" :label="group.label">
            <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
        <el-select size="small" v-model="listQuery.priority" placeholder="任务优先级" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="不急" value="0"></el-option>
          <el-option label="轻微" value="1"></el-option>
          <el-option label="一般" value="2"></el-option>
          <el-option label="紧需" value="3"></el-option>
          <el-option label="致命" value="4"></el-option>
        </el-select>
      </template>
    </AsgHighSearch>
    <main v-if="!isMobile">
      <div class="asg-table-main">
        <table v-loading="loading" element-loading-text="系统加载中，请稍等" element-loading-spinner="el-icon-loading">
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
                  <el-tooltip class="item" effect="dark" :content="item.taskName" placement="top-start">
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
                  <p class="my-task-auth margin-icon" v-else-if="item.status === '1'">
                    <i class="el-icon-warning"></i>待审核
                  </p>
                  <p class="my-task-success margin-icon" v-else-if="item.status === '2'">
                    <i class="el-icon-success"></i>已完成
                  </p>
                  <p class="my-task-error margin-icon" v-else-if="item.status === '3'">
                    <i class="el-icon-error"></i>已驳回
                  </p>
                </td>
                <td align="center" width="150">
                  <template v-if="['0', '3'].includes(item.status)">
                    <el-button type="text" @click="handleEdit(item)">编辑</el-button>
                    <el-button type="text" @click="handleNotice(item)">通知</el-button>
                  </template>
                  <template v-if="item.status === '1'">
                    <el-button type="text" @click="handleTaskDone('通过', item, '2')">通过</el-button>
                    <el-button style="color: #f40" type="text" @click="handleTaskDone('驳回', item, '3')">驳回</el-button>
                  </template>
                  <el-button type="text" @click="viewTask(item)">查看</el-button>
                  <el-button v-if="!['1', '2'].includes(item.status)" style="color: #f40" type="text"
                    @click="deleteTaskItem(item.id, item.createUserId)">删除</el-button>
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
      </div>
      <el-pagination style="margin-top: 18px; text-align: right" @size-change="handleChange($event, 'limit')"
        @current-change="handleChange($event, 'page')" :current-page="pageQuery.page" :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </main>
    <template v-else>
      <mobileTable :loading="loading" :table-data="tableData" :table-props="tableProps">
        <template #priority="{ row }">
          <p :class="`level-${row.priority}`">
            {{ row.priority | filterPriority }}
          </p>
        </template>
        <template #status="{ row }">
          <p class="my-task-info margin-icon" v-if="row.status === '0'">
            <i class="el-icon-time"></i>进行中
          </p>
          <p class="my-task-auth margin-icon" v-else-if="row.status === '1'">
            <i class="el-icon-warning"></i>待审核
          </p>
          <p class="my-task-success margin-icon" v-else-if="row.status === '2'">
            <i class="el-icon-success"></i>已完成
          </p>
          <p class="my-task-error margin-icon" v-else-if="row.status === '3'">
            <i class="el-icon-error"></i>已驳回
          </p>
        </template>
        <template #operation="{ row }">
          <template v-if="['0', '3'].includes(row.status)">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" @click="handleNotice(row)">通知</el-button>
          </template>
          <template v-if="row.status === '1'">
            <el-button type="text" @click="handleTaskDone('通过', row, '2')">通过</el-button>
            <el-button style="color: #f40" type="text" @click="handleTaskDone('驳回', row, '3')">驳回</el-button>
          </template>
          <el-button type="text" @click="viewTask(row)">查看</el-button>
          <el-button v-if="!['1', '2'].includes(row.status)" style="color: #f40" type="text"
            @click="deleteTaskItem(row.id, row.createUserId)">删除</el-button>
        </template>
      </mobileTable>
      <div class="container-page">
        <mobilePage :page="pageQuery.page" :total="total" :limit="pageQuery.limit"
          @current-change="handleChange($event, 'page')"></mobilePage>
      </div>
    </template>

    <el-dialog :fullscreen="isMobile" class="blue-text" title="编辑任务" :visible.sync="dialogVisible" width="40%"
      @close="resetForm">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" :label-position="isMobile ? 'top' : 'right'"
        label-width="150px">
        <el-form-item class="blue-text" label="任务标题" prop="taskName">
          <el-input size="small" v-model="editForm.taskName"></el-input>
        </el-form-item>
        <el-form-item class="blue-text" label="任务描述" prop="taskDescription">
          <el-input size="small" type="textarea" v-model="editForm.taskDescription" :rows="5" placeholder="请输入任务描述"
            maxlength="200" show-word-limit clearable></el-input>
        </el-form-item>
        <el-form-item class="blue-text" label="任务执行人员" prop="money">
          <!-- <el-select size="small" v-model="editForm.userId" placeholder="选择人员" @change="handleSelectChange">
            <el-option-group v-for="group in personList" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </el-select> -->
          <el-input v-model="editForm.chinaname" size="small" @focus="openPersonChoose">
          </el-input>
        </el-form-item>
        <el-form-item class="blue-text" label="任务积分" prop="money">
          <el-input-number size="small" v-model="editForm.money" :min="0" :max="5"></el-input-number>
        </el-form-item>
        <el-form-item class="blue-text" label="任务优先级" prop="money">
          <AsgPriorityComp :priority.sync="editForm.priority"></AsgPriorityComp>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看弹窗 -->
    <taskHistory ref="taskHistory" :row="row" :isMobile="isMobile"></taskHistory>
    <AsgPersonChoose ref="asgPersonChoose" @finish="finishChoosePerson"></AsgPersonChoose>
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
import AsgHighSearch from "@/components/AsgHighSearch.vue";
import { getUsersWithRole } from "@/api/schedule/index.js";
import { filterRole } from "@/utils/filters";
import { isMobile } from "@/utils";
import mobileTable from "@/components/mobile/mobileTable.vue";
import mobilePage from "@/components/mobile/mobilePage.vue";
import AsgPersonChoose from "@/components/AsgPersonChoose.vue";

export default {
  name: "taskManager",
  components: {
    taskHistory,
    AsgPriorityComp,
    AsgHighSearch,
    mobileTable,
    mobilePage,
    AsgPersonChoose
  },
  data() {
    return {
      listQuery: {
        userId: "",
        priority: "",
        status: "",
      },
      isMobile: false,
      tableData: [],
      loading: false,
      pageQuery: {
        page: 1,
        limit: 10,
      },
      total: null,
      tableProps: [
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '任务标题',
          prop: 'taskName',
          type: 'prop'
        },
        {
          label: '任务描述',
          prop: 'taskDescription',
          type: 'prop'
        },
        {
          label: '任务执行者',
          prop: 'chinaname',
          type: 'prop'
        },
        {
          label: '优先级',
          prop: 'priority',
          type: 'slot'
        },
        {
          label: '任务状态',
          prop: 'status',
          type: 'slot'
        },
        {
          label: '操作',
          prop: 'operation',
          type: 'slot'
        }
      ],
      row: {},
      dialogVisible: false,
      editForm: {
        taskId: "",
        taskName: "",
        taskDescription: "",
        money: null,
        userId: '',
        chinaname: '',
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
      personList: [],
      list: [],
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
  async created() {
    this.isMobile = isMobile();
    const roleResult = await getUsersWithRole();
    this.list = (roleResult?.data ?? []).flat(Infinity);
    this.createdOptions(this.list);
    this.initTask();
  },
  methods: {
    finishChoosePerson(node){
      console.log(node, 'node===');
      this.editForm.userId = node.id;
      this.editForm.chinaname = node.label;
    },
    // handleSelectChange(value){
    //   this.editForm.chinaname = this.list.find(item => item.id === value)?.chinaname ?? '';
    // },
    openPersonChoose(){
      this.$refs.asgPersonChoose?.openDialog();
    },
    createdOptions(arr) {
      let result = [];
      for (const item of arr) {
        const index = result.findIndex((el) => el.code === item.officium);
        if (index !== -1) {
          result[index].options.push({
            label: item.chinaname,
            value: item.id,
          });
        } else {
          result.push({
            code: item.officium,
            label: filterRole(item.officium),
            options: [{
              label: item.chinaname,
              value: item.id,
            }],
          });
        }
      }
      this.personList = result.filter(item => item.options && item.options.length > 0);
    },
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
        if (this.userInfo.id === item.userId) throw new Error('操作失败，您不能审批自己的任务！');
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
        this.$message.error(error.message);
      }
    },
    async initTask(type) {
      try {
        if (!!type && type === "reset") {
          this.listQuery = {
            priority: "",
            userId: '',
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
        this.tableData = data.data.rows;
        const number = this.tableData.filter(item => item.status === '1').length ?? 0;
        this.$store.commit("SET_WAITAUTH_NUMBER", number);
        this.total = data.data.total;
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
        userId: item.userId,
        chinaname: item.chinaname
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

.container-page {
  margin: 0 auto;
  width: 95%;
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

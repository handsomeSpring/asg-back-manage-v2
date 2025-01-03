<template>
  <div>
    <header>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="openDialog('add')">开启新赛季</el-button>
    </header>
    <div class="asg-table-main" v-if="events.length > 0" v-loading="loading">
      <asg-table-card v-for="(item, index) in events" :key="index">
        <template #header>
          <div class="asg-header">
            <div class="header-left">
              <span class="fontWeight">{{ item.name }}</span>
              <span class="time-info">
                {{ new Date(item.opentime) | parseTime("{y}-{m}-{d}") }}</span>
              <el-tag size="small" :type="item.is_over ? 'danger' : 'primary'">{{ item.is_over ? "已结束" : "进行中"
                }}</el-tag>
            </div>
            <div class="header-operation">
              <el-button type="text" @click="checkRuleInfo(item)">
                预览规则
              </el-button>
              <el-button type="text" @click="handleUpdate(item)">
                编辑赛季
              </el-button>
              <el-button style="color: #f40" type="text" @click="deleteItem(item.id)">
                删除赛季
              </el-button>
            </div>
          </div>
        </template>
        <template #content>
          <div class="progress-content">
            <AsgProgress :status="item.status"></AsgProgress>
          </div>
        </template>
      </asg-table-card>
    </div>
    <div class="no-message" v-else>暂无赛季</div>
    <!-- 赛季详情 -->
    <el-dialog top="5vh" :close-on-click-modal="false" append-to-body :title="title" width="70%"
      :visible.sync="dialogVisible">
      <el-alert type="warning" title="赛季状态提示">
        <el-steps :active="6" align-center>
          <el-step title="筹备中" description="用户不可以报名、不可以修改表单、不可以查看报名队伍"></el-step>
          <el-step title="报名中" description="用户可以报名、不可以修改表单、不可以查看报名队伍"></el-step>
          <el-step title="建联期" description="用户不可以报名、已经报名的队伍可以修改表单、不可以查看报名队伍"></el-step>
          <el-step title="公示期" description="报名、修改表单停止、用户可以查看所有报名的队伍并进行关注"></el-step>
          <el-step title="进行中" description="报名、修改表单停止、用户关注停止"></el-step>
          <el-step title="已结束" description="报名、修改表单停止、用户关注停止"></el-step>
        </el-steps>
      </el-alert>
      <el-form ref="seasonForm" :model="seasonForm" label-width="120px" label-position="right" :rules="formRules">
        <el-row type="flex">
          <el-col :span="11">
            <el-form-item label="赛季名" prop="name">
              <el-input size="mini" v-model="seasonForm.name" placeholder="输入赛季名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="赛季开始时间" prop="opentime">
              <el-date-picker v-if="type === 'add'" v-model="seasonForm.opentime" size="small" type="datetime"
                placeholder="选择日期时间" value-format="yyyy-MM-ddThh:mm:ss.656Z" format="yyyy-MM-dd hh:mm:ss">
              </el-date-picker>
              <el-input v-else v-model="seasonForm.opentime" size="small" placeholder="格式yyyy-MM-ddThh:mm:ss.656Z">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="报名是否结束">
              <el-radio-group v-model="seasonForm.is_over" size="small">
                <el-radio-button :label="true">已结束</el-radio-button>
                <el-radio-button :label="false">进行中</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="赛季状态">
              <el-radio-group v-model="seasonForm.status" size="small">
                <el-radio label="0">筹备中</el-radio>
                <el-radio label="1">报名中</el-radio>
                <el-radio label="2">建联期</el-radio>
                <el-radio label="3">公示中</el-radio>
                <el-radio label="4">进行中</el-radio>
                <el-radio label="5">赛季结束</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <template>
          <label><span style="color: #f40">*</span>赛季规则</label>
          <el-row style="margin-top: 12px">
            <v-md-editor v-model="rules" height="400px" width="800"></v-md-editor>
          </el-row>
        </template>
        <div style="text-align: right; margin-top: 12px">
          <el-button v-if="type === 'add'" size="small" type="primary" @click="handleAddEvent">发布</el-button>
          <el-button v-else type="primary" size="small" @click="updateItem">更新</el-button>
          <el-button size="small" plain @click="dialogVisible = false">关 闭</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 赛季规则 -->
    <el-dialog top="5vh" title="规则详情" append-to-body width="60%" :visible.sync="checkDialogVisible">
      <el-scrollbar style="height: 55vh">
        <v-md-preview :text="checkRules" height="400px" width="800"></v-md-preview>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import {
  pushNewEvents,
  getAllEvents,
  deleteEvents,
  updateEvents,
} from "@/api/gameSeason/index";
import asgTableCard from "@/components/asg-table-card.vue";
import AsgProgress from './components/AsgProgress.vue';
export default {
  name: "seasonManage",
  components: {
    asgTableCard,
    AsgProgress
  },
  data() {
    return {
      seasonForm: {
        status: "0",
        name: "",
        is_over: false,
        opentime: new Date(),
      },
      type: "",
      events: [],
      loading: false,
      dialogVisible: false, //新增/编辑窗口
      rules: "",
      title: "新增赛季",

      checkRules: "",
      checkDialogVisible: false,
      formRules: {
        name: [{ required: true, message: "请填写赛季名称", trigger: "blur" }],
        opentime: [
          { required: true, message: "请填写赛季开始时间", trigger: "change" },
        ],
      },
    };
  },
  computed: {
    serveIp() {
      return window.SERVE_IP;
    },
  },
  watch: {
    'seasonForm.is_over': {
      handler(newVal) {
        if (newVal) {
          this.seasonForm.status = '5'
        } else {
          this.seasonForm.status = '4'
        }
      }
    },
    'seasonForm.status': {
      handler(newVal) {
        if (newVal === '5') {
          this.seasonForm.is_over = true
        }
      }
    }
  },
  created() {
    this.initEvents();
  },
  methods: {
    async checkRuleInfo(row) {
      try {
        this.checkDialogVisible = true;
        await this.getRule(row);
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async getRule(data) {
      try {
        const result = await fetch(`${this.serveIp}/doc/rule/${data.name}.md`);
        const res = await result.text();
        this.checkRules = res || "未设置规则";
      } catch (error) {
        this.checkRules = "暂无规则";
      }
    },
    async handleUpdate(row) {
      const result = await fetch(`${this.serveIp}/doc/rule/${row.name}.md`);
      const res = await result.text();
      this.rules = res || "未设置规则";
      this.openDialog("edit");
      this.seasonForm = row;
    },
    openDialog(type) {
      this.title = type === "edit" ? "更新赛季" : "新增赛季";
      this.type = type;
      if (type === "add") {
        this.seasonForm = {
          status: "0",
          name: "",
          is_over: false,
          opentime: new Date(),
        };
        this.rules = "";
      }
      this.dialogVisible = true;
    },
    handleAddEvent() {
      if (!this.rules) {
        return this.$message.warning("请先设置赛季规则");
      }
      this.$refs.seasonForm.validate(async (valid) => {
        if (valid) {
          const nameMap = this.events.map((item) => item.name);
          if (nameMap.includes(this.seasonForm.name)) {
            return this.$message.error(
              "赛季名称与历史赛季名称重复，请更换赛季名称"
            );
          }
          const reqDTO = {
            ...this.seasonForm,
            rule_markdown: this.rules,
          };
          pushNewEvents(reqDTO)
            .then(({ status }) => {
              if (status !== 200) throw new Error("服务端异常，新增赛季失败！");
              this.$message.success("新增赛季成功！");
              this.initEvents();
            })
            .catch((error) => {
              this.$message.error(error.message);
            })
            .finally(() => {
              this.dialogVisible = false;
            });
        }
      });
    },
    async initEvents() {
      try {
        this.loading = true;
        const { data, status } = await getAllEvents();
        if (status !== 200) throw new Error("服务端异常，获取赛季失败！");
        this.events = data;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    deleteItem(id) {
      this.$confirm("是否删除赛季?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteEvents(id)
            .then(() => {
              this.$message.success("删除成功！");
              this.initEvents();
            })
            .catch((err) => {
              if (err?.response?.data) {
                return this.$message.error(err.response.data.message);
              }
              this.$message.error("服务器异常，请联系管理员！");
            });
        })
        .catch(() => { });
    },
    async updateItem() {
      try {
        const req = {
          ...this.seasonForm,
          rule_markdown: this.rules,
        };
        const { status } = await updateEvents(req);
        if (status !== 200) throw new Error("服务端异常，请联系网站管理员！");
        this.dialogVisible = false;
        this.$message.success("更新成功！");
        this.initEvents();
      } catch (error) {
        this.$message.error(error.message);
      }
    },
  },
};
</script>

<style scoped lang="less">
header {
  margin: 0 0 12px;
}

.asg-header {
  height: inherit;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .fontWeight {
      font-weight: 600;
      color: #4f73eb;
    }

    .time-info {
      font-size: 14px;
      color: #333333;
      font-weight: 400;
    }
  }

  // 操作按钮
  .header-operation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
  }
}

.progress-content {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// .season_text {
//   color: rgb(161, 175, 241);
//   text-decoration: underline;
//   font-weight: bold;
//   text-underline-offset: 0.2rem;
// }
.no-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  width: 100%;
  color: #979797;
  border-top: 1px solid #979797;
}
</style>

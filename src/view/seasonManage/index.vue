<template>
  <div>
    <header>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="openDialog('add')">开启新赛季</el-button>
    </header>
    <el-scrollbar style="height: 70vh">
      <baseTable v-loading="loading" :data="events" :column="tableProps">
        <template #projectHeader="{ data }">
          <div>
            <span class="fontWeight">{{ data.name }}</span>
          </div>
          <div>
            <span><i class="el-icon-edit" style="
                  color: rgb(91, 182, 242);
                  font-size: 16px;
                  cursor: pointer;
                " @click="handleUpdate(data)"></i></span>
            <i class="el-icon-delete" style="color: red; font-size: 16px; cursor: pointer"
              @click="deleteItem(data.id)"></i>
          </div>
        </template>
        <template #opentime="{ data }">
          {{ new Date(data.opentime) | parseTime("{y}-{m}-{d}") }}
        </template>
        <template #over="{ data }">
          <el-tag :type="data.is_over ? 'danger' : 'primary'">{{
            data.is_over ? "已结束" : "进行中"
          }}</el-tag>
        </template>
        <template #status="{ data }">
          <span class="season_text">{{ data.status | filterStatus }}</span>
        </template>
        <template #rule="{ data }">
          <el-button type="text" @click="checkRuleInfo(data)">
            预览规则
          </el-button>
        </template>
      </baseTable>
    </el-scrollbar>
    <el-dialog top="5vh" :close-on-click-modal="false" append-to-body :title="title" width="70%"
      :visible.sync="dialogVisible">
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
                <el-radio label="0">未开始</el-radio>
                <el-radio label="1">报名中</el-radio>
                <el-radio label="2">公开报名中</el-radio>
                <el-radio label="3">表单修改期</el-radio>
                <el-radio label="4">比赛中</el-radio>
                <el-radio label="5">赛季结束</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <template>
          <label>赛季规则<span style="color: #f40; font-weight: bold">（*一旦上传规则，将无法修改）</span></label>
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
    <el-dialog top="5vh" title="规则详情" append-to-body width="60%"
      :visible.sync="checkDialogVisible">
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
import baseTable from "@/components/baseTable.vue";
export default {
  name: "seasonManage",
  components: {
    baseTable,
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
      tableProps: [
        {
          type: "index",
          label: "序号",
          props: "index",
          style: {
            textAlign: "center",
            minWidth: "80px",
          },
        },
        {
          type: "opentime",
          label: "开启时间",
          prop: "opentime",
          slot: true,
          style: {
            textAlign: "center",
            width: "200px",
          },
        },
        {
          type: "over",
          label: "是否结束",
          prop: "over",
          slot: true,
          style: {
            textAlign: "center",
            minWidth: "100px",
          },
        },
        {
          type: "status",
          label: "赛季执行阶段",
          prop: "status",
          slot: true,
          style: {
            textAlign: "center",
            minWidth: "150px",
          },
        },
        {
          type: "rule",
          label: "规则",
          prop: "rule",
          slot: true,
          style: {
            textAlign: "center",
            minWidth: "120px",
          },
        },
      ],
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
  filters: {
    filterStatus(val) {
      const mapList = {
        0: "未开始",
        1: "报名中",
        2: "公开报名中",
        3: "表单修改期",
        4: "比赛中",
        5: "赛季结束",
      };
      return mapList[val];
    },
  },
  computed: {
    serveIp() {
      return window.SERVE_IP;
    },
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
          pushNewEvents(reqDTO).then(({ status }) => {
            if (status !== 200) throw new Error('服务端异常，新增赛季失败！');
            this.$message.success('新增赛季成功！');
            this.initEvents();
          }).catch(error => {
            this.$message.error(error.message);
          }).finally(() => {
            this.dialogVisible = false;
          })
        }
      });
    },
    async initEvents() {
      try {
        this.loading = true;
        const { data, status } = await getAllEvents();
        if (status !== 200) throw new Error('服务端异常，获取赛季失败！');
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
        }
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

.fontWeight {
  font-weight: bold;
  color: #4f73eb;
}
.season_text{
  color: rgb(161, 175, 241);
  text-decoration: underline;
  font-weight: bold;
  text-underline-offset: 0.2rem;
}
</style>

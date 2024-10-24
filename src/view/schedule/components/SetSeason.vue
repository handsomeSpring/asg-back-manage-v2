<template>
  <div>
    <header>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="openDialog('add')">新开赛季</el-button>
    </header>
    <el-scrollbar style="height: 60vh">
      <baseTable v-loading="loading" :data="events" :column="tableProps">
        <template #projectHeader="{ data }">
          <div>
            <span>赛季名</span>
            <span class="fontWeight">{{ data.name }}</span>
          </div>
          <div>
            <span><i class="el-icon-edit" style="color: rgb(91, 182, 242); font-size: 16px; cursor: pointer"
                @click="handleUpdate(data)"></i></span>
            <i class="el-icon-delete" style="color: red; font-size: 16px; cursor: pointer"
              @click="deleteItem(data.name)"></i>
          </div>
        </template>
        <template #opentime="{ data }">
          {{ new Date(data.opentime) | parseTime("{y}-{m}-{d}") }}
        </template>
        <template #status="{ data }">
          <el-tag :type="data.is_over ? 'danger' : 'primary'">{{
            data.is_over ? "已结束" : "进行中"
          }}</el-tag>
        </template>
        <template #rule="{ data }">
          <el-button type="text" @click="checkRuleInfo(data)">
            查看规则详情
          </el-button>
        </template>
      </baseTable>
    </el-scrollbar>
    <el-dialog :close-on-click-modal="false" append-to-body :title="title" width="60%" :visible.sync="dialogVisible">
      <el-form :inline="true" :model="seasonForm" class="demo-form-inline">
        <el-row type="flex" style="justify-content: start">
          <el-form-item label="赛季名">
            <el-input size="mini" v-model="seasonForm.name" placeholder="输入赛季名"></el-input>
          </el-form-item>

          <el-form-item label="赛季开始时间" prop="opentime">
            <el-date-picker v-if="type==='add'" v-model="seasonForm.opentime" size="small" type="datetime" placeholder="选择日期时间"
              value-format="yyyy-MM-ddThh:mm:ss.656Z" format="yyyy-MM-dd hh:mm:ss">
            </el-date-picker>
            <el-input v-else v-model="seasonForm.opentime" size="small"  placeholder="格式yyyy-MM-ddThh:mm:ss.656Z">
            </el-input>
          </el-form-item>
          <el-form-item label="报名是否结束">
            <el-radio-group v-model="seasonForm.is_over" size="small">
              <el-radio-button :label="true">已结束</el-radio-button>
              <el-radio-button :label="false">进行中</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <template v-if="type === 'add'">
          <label>赛季规则<span style="color:#f40;font-weight: bold;">（*一旦上传规则，将无法修改）</span></label>
          <el-row style="margin-top: 12px;">
            <v-md-editor v-model="rules" height="400px" width="800"></v-md-editor>
          </el-row>
        </template>
        <div style="text-align: center;margin-top: 12px;">
          <el-button v-if="type === 'add'" type="primary" @click="pushNewEvents">发布</el-button>
          <el-button v-else type="primary" @click="updateItem(seasonForm)">更新</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog top="5vh" title="规则详情" :close-on-click-modal="false" append-to-body width="60%" :visible.sync="checkDialogVisible">
      <el-scrollbar style="height:55vh">
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
  name: "SetSeason",
  components: {
    baseTable,
  },
  data() {
    return {
      seasonForm: {
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
            textAlign: "left",
            width: "400px",
          },
        },
        {
          type: "status",
          label: "状态",
          prop: "status",
          slot: true,
          style: {
            textAlign: "center",
            minWidth: "100px",
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
      checkRules: '',
      checkDialogVisible: false,
    };
  },
  computed: {
    serveIp() {
      return window.SERVE_IP;
    }
  },

  mounted() {
    this.initEvents();
  },
  methods: {
    async checkRuleInfo(row) {
      try {
        this.checkDialogVisible = true;
        await this.getRule(row);
      } catch (error) {
        this.$message.error(error.message)
      }

    },
    async getRule(data) {
      try {
        const result = await fetch(`${this.serveIp}/doc/rule/${data.name}.md`);
        const res = await result.text();
        this.checkRules = res  || '未设置规则';
      } catch (error) {
        this.checkRules = "暂无规则"
      }
    },
    handleUpdate(row) {
      this.openDialog("edit");
      this.seasonForm = {
        ...row,
      };
    },
    openDialog(type) {
      this.dialogVisible = true;
      this.type = type;
      if (type === "add") {
        this.seasonForm = {
          is_over: false
        };
        this.rules = ""
      }
    },
    pushNewEvents() {
      const nameMap = this.events.map(item => item.name);
      if (nameMap.includes(this.seasonForm.name)) {
        return this.$message.error('赛季名重复,请检查');
      }

      if (!this.rules) {
        return this.$message.warning("请先设置赛季规则");
      }
      if (!this.seasonForm.name || !this.seasonForm.opentime) {
        return this.$message.error('赛季名、赛季开始时间不能为空');
      }
      const pushObj = {
        name: this.seasonForm.name,
        is_over: this.seasonForm.is_over,
        opentime: this.seasonForm.opentime,
        rule_markdown: this.rules
      }
      pushNewEvents(pushObj)
        .then((res) => {
          this.$message.success(res.data);
          this.dialogVisible = false;
        })
        .catch((err) => {
          this.dialogVisible = false;
        })
        .finally(() => {
          this.dialogVisible = false;
        });

    },
    initEvents() {
      this.loading = true;
      getAllEvents()
        .then((res) => {
          let { data } = res;
          this.events = data;
          this.loading = false;
        })

        .catch(() => {
          this.$message.error("服务器异常，请联系管理员！");
          this.loading = false;
        });
    },
    deleteItem(name) {
      this.$confirm("是否删除赛季?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteEvents(name)
            .then(() => {
              this.$message.success("删除成功！");
              this.initEvents();
            })
            .catch(() => {
              this.$message.error("服务器异常，请联系管理员！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    updateItem(row) {
      updateEvents(row.name, row)
        .then(() => {
          this.dialogVisible = false;
          this.$message.success("更新成功！");
          this.initEvents();
        })
        .catch(() => {
          this.$message.error("服务器异常！");
        });
    }
  },
};
</script>

<style scoped lang="less">
header {
  margin: 0 0 12px;
}

.fontWeight {
  font-weight: bold;
}

.a-text {
  color: rgb(161, 175, 241);
  text-decoration: underline;
}
</style>

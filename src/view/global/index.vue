<template>
  <div>
    <AsgHighSearch showOperation>
      <template #top>
        <p class="high-light">
          <i class="el-icon-warning" style="margin-right:12px"></i>注意：全局参数的配置会影响整个系统（不要随便修改，请咨询超级管理员修改）
        </p>
      </template>
      <template #search>
        <el-input v-model="listQuery.msg" size="small" clearable placeholder="请输入说明进行检索"></el-input>
      </template>
      <template #btnList>
        <el-button size="small" type="primary" @click="resetPageSearch">查询</el-button>
        <el-button plain size="small" @click="handleResetSearch">重置</el-button>
      </template>
      <template #operation>
        <el-button icon="el-icon-plus" size="small" type="primary" @click="openDialog('add')">新增配置</el-button>
      </template>
    </AsgHighSearch>
    <main>
      <div class="asg-table-main">
        <el-table v-loading="loading" element-loading-text="数据加载中，请稍等"
        element-loading-spinner="el-icon-loading" :header-cell-style="tableColor" :data="tableData" stript
        style="width: 100%">
        <el-table-column prop="id" label="序号" width="80"> </el-table-column>
        <el-table-column prop="title" label="编码" width="180">
        </el-table-column>
        <el-table-column prop="msg" label="说明" width="180"> </el-table-column>
        <el-table-column prop="substance" label="值"> </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button size="small" type="text" @click="openDialog('edit', row)">编辑</el-button>
            <el-button size="small" type="text" style="color: #f40" @click="deleteItem(row.id)">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
      </div>
      <el-pagination background style="float: right; margin-top: 12px" @size-change="handleChange('limit', $event)"
        @current-change="handleChange('page', $event)" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </main>
    <el-dialog top="5vh" :visible.sync="dialogVisible" :title="`${title}配置`" width="60%" :close-on-click-modal="false">
      <el-form :model="system" :rules="rules" ref="ruleForm" label-position="right" label-width="80px"
        class="demo-ruleForm">
        <el-form-item label="编码" prop="title">
          <el-input v-model="system.title" placeholder="请输入编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="值" prop="substance">
          <el-input v-model="system.substance" disabled placeholder="请输入值">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="msg">
          <el-input v-model="system.msg" placeholder="请输入备注" clearable>
          </el-input>
        </el-form-item>
        <editor height="400" width="100%" ref="editor" :content="system.substance" v-model="system.substance"
          theme="json" :options="editorOptions" lang="javascript" @init="editorInit">
        </editor>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="checkSubmit('ruleForm')">{{ title }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getConfig, addConfig, deleteConfig } from "@/api/config/index.js";
import AsgHighSearch from "@/components/AsgHighSearch.vue";
export default {
  name: "globalConfig",
  components: {
    AsgHighSearch
  },
  data() {
    return {
      listQuery: {
        msg: "",
        page: 1,
        limit: 10,
      },
      content: "",
      editorOptions: {
        // 设置代码编辑器的样式
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        tabSize: 6,
        fontSize: 14,
        showPrintMargin: false, //去除编辑器里的竖线
        theme: "monokai",
      },
      total: 0,
      tableData: [],
      system: {},
      dialogVisible: false,
      rules: {
        title: [{ required: true, message: "请输入编码", trigger: "change" }],
        substance: [
          { required: true, message: "请输入编码值", trigger: "change" },
        ],
        msg: [{ required: true, message: "请输入备注", trigger: "change" }],
      },
      title: "新增",
      loading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleChange(prop, $event) {
      this.listQuery = {
        ...this.listQuery,
        [prop]: $event,
      };
      this.getList();
    },
    editorInit(editor) {
      require("brace/ext/language_tools");
      require("brace/mode/java");
      require("brace/mode/mysql");
      require("brace/mode/json");
      require("brace/mode/xml");
      require("brace/theme/chrome");
      require("brace/theme/github");
      require("brace/theme/eclipse");
      require("brace/theme/dracula");
      require("brace/snippets/java");
      require("brace/snippets/mysql");
      require("brace/ext/beautify");
    },
    tableColor() {
      return { background: "#f2f6fd" };
    },
    resetPageSearch() {
      this.listQuery = {
        ...this.listQuery,
        page: 1,
        limit: 10
      };
      this.getList();
    },
    handleResetSearch() {
      this.listQuery = {
        page: 1,
        limit: 10,
        msg: "",
      };
      this.getList();
    },
    openDialog(type, row = {}) {
      this.dialogVisible = true;
      if (type === "add") {
        this.title = "新增";
        this.system = {};
      } else {
        this.title = "更改";
        this.system = row;
      }
    },
    async getList() {
      try {
        this.loading = true;
        const { data, status } = await getConfig(this.listQuery);
        if (status !== 200) throw new Error('服务端异常，请联系网站管理员！');
        this.tableData = data?.data?.rows ?? [];
        this.total = data?.data?.total ?? 0;
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    checkSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateForm();
        } else {
          this.$message.error("请完整填写表单！");
          return false;
        }
      });
    },
    async updateForm() {
      try {
        const result = await addConfig(this.system);
        this.$message.success("添加成功！");
        this.getList();
        this.dialogVisible = false;
      } catch (error) {
        this.$message.error(error);
      }
    },
    deleteItem(id) {
      this.$confirm("是否确认删除该配置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteConfig(id)
            .then(() => {
              this.$message.success("删除成功！");
              this.getList();
            })
            .catch((err) => {
              this.$message.error(err);
            });
        })
        .catch(() => { });
    },
  },
};
</script>

<style scoped lang="less">
</style>

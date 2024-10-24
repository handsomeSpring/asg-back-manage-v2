<template>
  <div class="main-box clearfix">
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="150px"
      label-position="right"
    >
      <el-form-item label="QQ群" prop="qqgrope">
        <el-select size="small" v-model="form.qqgrope" placeholder="请选择">
          <el-option
            v-for="item in groups"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否@全体人员" prop="is_atall">
        <el-radio-group v-model="form.is_atall" size="small">
          <el-radio-button :label="true">是</el-radio-button>
          <el-radio-button :label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发送内容" prop="text">
        <el-input
          type="textarea"
          :rows="5"
          size="small"
          v-model="form.text"
          placeholder="请输入发布内容"
        ></el-input>
      </el-form-item>
      <el-button
        style="float:right;width: calc(100% - 150px)"
        size="small"
        type="primary"
        @click="handleSend('ruleForm')"
        >发送</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { sendMsg } from "@/api/admin/index.js";
import { getByTitle } from "@/api/config";
export default {
  name: "bot",
  data() {
    return {
      form: {
        qqgrope: "",
        is_atall: false,
        text: "",
      },
      groups: [],
      rules: {
        qqgrope: [{ required: true, message: "请输入群号", trigger: "blur" }],
        is_atall: [
          { required: true, message: "请选择是否通知全体", trigger: "change" },
        ],
        text: [{ required: true, message: "请输入发布内容", trigger: "blur" }],
      },
    };
  },
  created() {
    this.initGroups();
  },
  methods: {
    handleSend(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendMsg();
        } else {
          this.$message.error("请完整填写内容！");
          return false;
        }
      });
    },
    sendMsg() {
      const loading = this.$loading({
        lock: true,
        text: "正在发布中......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
      sendMsg(this.form)
        .then(() => {
          loading.close();
          this.form.text = "";
          this.$message.success("发布成功！");
        })
        .catch((err) => {
          loading.close();
          this.$message.error(err);
        });
    },
    initGroups() {
      getByTitle("groupList")
        .then((res) => {
          this.groups = res.data;
        })
        .catch((err) => {
          this.$message.error("获取云端配置失败！");
        });
    },
  },
};
</script>

<style scoped lang="less">
.main-box {
  width:50vw;
  margin: 20px 20%;
  padding: 25px;
  border: 1px solid #efefef;
}
</style>

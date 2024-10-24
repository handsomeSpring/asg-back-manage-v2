<template>
    <div class="content clearfix">
      <h2>发送邮箱功能<i class="el-icon-message"></i></h2>
      <el-form
        :model="emailForm"
        :rules="rules"
        ref="emailForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="邮箱地址" prop="email">
          <el-input v-model="emailForm.email"></el-input>
        </el-form-item>
        <el-form-item label="邮箱标题" prop="title">
          <el-input v-model="emailForm.title"></el-input>
        </el-form-item>
        <el-form-item label="邮箱内容" prop="msg">
          <el-input
            type="textarea"
            rows="4"
            v-model="emailForm.msg"
            maxlength="500"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-button 
        type="primary" 
        style="float:right;width:calc(100% - 100px)" 
        size = "small"
        v-loading="loading"
        @click="sendEmailInfo('emailForm')"
        >发送
        </el-button>
      </el-form>
    </div>
</template>

<script>
import { sendEmail } from "@/api/email/index.js";
export default {
  name: "sendE",
  data() {
    return {
      emailForm: {
        email: "",
        title: "",
        msg: "",
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
        ],
        title: [
          { required: true, message: "请输入邮箱标题", trigger: "blur" },
        ],
        msg: [
          { required: true, message: "请输入邮箱内容", trigger: "blur" },
        ],
      },
      loading:false
    };
  },
  methods: {
    sendEmailInfo(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            const query = {
                To:this.emailForm.email,
                Title:this.emailForm.title,
                msg:this.emailForm.msg
            }
            sendEmail(query).then(()=>{
                this.$message.success("发送成功！")
                this.loading = false
            })
            .catch((err)=>{
               this.$message.error(err.response.data.msg)
               this.loading = false
            })
          } else {
            this.$message.error('请完整填写表单内容！');
            return false;
          }
        });
    }
  },
};
</script>

<style scoped lang="less">
.content {
  margin: 20px 20%;
  padding: 25px;
  border: 1px solid #efefef;
  h2 {
    margin: 0 0 10px 30px;
    color: #a7a7a7;
  }
}
.banner {
  margin-bottom: 20px;
}
</style>

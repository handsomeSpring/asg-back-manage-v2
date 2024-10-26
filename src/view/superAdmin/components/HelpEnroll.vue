<template>
  <div>
    <el-alert title="提示" type="warning" :closable="false" description="优先让用户自己注册，实在注册不上再通过超管注册，因为这样注册会暴露用户的密码，谨慎使用！">
    </el-alert>
    <el-card class="card__content" shadow="hover">
      <el-form ref="form" :model="form" label-position="left" label-width="120px" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input style="width:250px" size="small" v-model="form.userName" placeholder="请输入用户名" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户中文名" prop="chinaname">
          <el-input style="width:250px" size="small" v-model="form.chinaname" placeholder="请输入用户中文名"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input style="width:250px" size="small" v-model="form.password" placeholder="请输入用户密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="二次输入密码" prop="rePassword">
          <el-input style="width:250px" size="small" v-model="form.rePassword" placeholder="请再次输入密码"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="用户qq号" prop="qqnumber">
          <el-input style="width:250px" size="small" v-model="form.qqnumber" placeholder="请输入qq号" clerable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="beforeEnroll" :loading="loading">注册</el-button>
          <el-button plain size="small" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="flex__item">
        <div class="arrow"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { adminEnrollUser } from '@/api/admin/index.js';
export default {
  name: 'HelpEnroll',
  data() {
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码！'));
      } else if (value !== this.form.password) {
        callback(new Error('两次密码不一致！'));
      } else {
        callback();
      }
    };
    var userName = (rule, value, callback) => {
      const chineseRegex = /[\u4e00-\u9fa5]/;
      if (value === '') {
        callback(new Error('请再次输入用户名！'));
      } else if (chineseRegex.test(value)) {
        callback(new Error('用户名不能出现中文！'));
      } else {
        callback();
      }
    }
    return {
      form: {
        userName: '',
        chinaname: '',
        password: '',
        rePassword: '',
        qqnumber: '',
      },
      loading: false,
      rules: {
        userName: [
          { required: true, validator: userName, trigger: 'blur' },
        ],
        chinaname: [
          { required: true, message: '请输入中文名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        rePassword: [
          { required: true, validator: checkPass, trigger: 'blur' }
        ],
        qqnumber: [
          { required: true, message: '请输入qq号', trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    handleReset() {
      this.form = {
        userName: '',
        chinaname: '',
        password: '',
        rePassword: '',
        qqnumber: '',
      };
      this.$refs.form && this.$refs.form.resetFields();
    },
    beforeEnroll() {
      this.$refs.form && this.$refs.form.validate(valid => {
        if (valid) {
          this.handleEnroll();
        } else {
          this.$message.error('请完整填写表单！');
        }
      })
    },
    async handleEnroll() {
      try {
        this.loading = true;
        const { rePassword, ...remain } = this.form;
        const { status } = await adminEnrollUser(remain);
        if (status !== 200) throw new Error('注册失败,服务端异常！');
      } catch (error) {
        this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
  },
  created() {

  },
}
</script>
<style lang='less' scoped>
.card__content {
  margin: 12px 0;
  padding: 24px;

  /deep/.el-card__body {
    display: grid;
    grid-template-columns: 50% 30%;
    align-items: center;
  }

  .flex__item {
    display: flex;
    align-items: center;
    justify-content: center;

    .arrow {
      width: 350px;
      height: 350px;
      -webkit-clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
      background-image: linear-gradient(to left, #fc0, #f99);
    }
  }
}
</style>
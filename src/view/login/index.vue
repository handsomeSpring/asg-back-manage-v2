<template>

  <div class="login-pc__container">
    <div class="login-pc__wrap">
      <div class="left-part">
        <div class="zhanwei"></div>
        <div class="text-container">
          <div class="big-title">AvengerS Gaming</div>
          <div class="text-info">
            第五人格ASG赛事后台管理系统，致力于结合数字化时代，多措并举，创办高效、高质量第五人格民间比赛，激发选手积极参与比赛的内生动力，成为ASG主办团队办赛的行动指南。</div>
        </div>
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div class="right-part">
        <div class="main-form">
          <div class="form-title">
            <h2>欢迎登录!</h2>
          </div>
          <div class="icon-list">
            <a href="https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0" target="_blank" class="icon-tab">
              <img class="icon-image" src="../../assets/images/person.png" />
            </a>
            <a href="https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0" target="_blank" class="icon-tab lighten-2">
              <img class="icon-image" src="../../assets/images/logo_black.png" />
            </a>
            <a href="https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0" target="_blank" class="icon-tab lighten-3">
              <img src="../../assets/images/goodsImg.png"
                class="icon-image" /></a>
          </div>
          <el-divider class="divider-login">使用用户名登录</el-divider>
          <div class="login-form">
            <label class="input-label">用户名</label>
            <input v-model="userform.username" @focus="isError = false" :class="isError ? 'error-input' : ''"
              class="input-side" type="" placeholder="请输入用户名" />
          </div>
          <div class="login-form">
            <label class="input-label">密码</label>
            <div class="input-container">
              <input v-model="userform.password" @focus="isError = false" :class="isError ? 'error-input' : ''"
              class="input-side" :type="inputtype" placeholder="请输入密码" />
              <i :class="eye_status" class="input-icon" @click="toggleEye"></i> <!-- 添加的图标 -->
            </div>

          </div>
          <!-- 底部按钮 -->
          <div class="login-form">
            <button @click="handleLogin" class="login-btn
                                    ">登 录<div v-show="gettersLoading" class="ml-2 loader"></div></button>
          </div>
        </div>
        <p class="register-info">
          <span>还没有账号？</span>
          <a href="https://commentary.idvasg.cn/#/" target="_blank" class="hilight-info
                                    ">立即注册</a>
        </p>
        <a download href="https://gitee.com/zhuo-spring/asg-tauri-project/releases/download/latest/ASG-Tauri_0.1.3_x64_en-US.msi">下载windows10客户端</a>
      </div>
    </div>
  </div>
</template>

<script>
import { loginUser } from "@/api/login/index";
import { getByTitle } from "@/api/config";
import { mapGetters } from "vuex";
import { isMobile } from '@/utils/index';
export default {
  name: "LoginComp",
  computed: {
    ...mapGetters(['gettersLoading'])
  },
  data() {
    return {
      userform: {
        username: "",
        password: "",
      },
      inputtype: "password",
      eye_status:'el-icon-lock',
      isError: false,
      isMobile: false,
    };
  },
  created() {
    this.isMobile = isMobile();
  },
  methods: {
    async login() {
      try {
        this.$store.commit("SET_FULL_LOADING", true);
        const { data, status, message } = await loginUser(this.userform);
        if (status !== 200) throw new Error(message);
        if (data.code && data.code === 404) throw new Error(data.message);
        this.$store.commit("setToken", data);
        await this.initRoles();
        const path = isMobile() ? '/mobileGuide' : '/guide';
        this.$router.push(path);
      } catch (error) {
        this.$store.commit("SET_FULL_LOADING", false);
        if (error.response?.data?.message) {
          return this.$message.error(error.response.data.message);
        }
        return this.$message.error(error.message);
      }
    },
    toggleEye() {
      if (this.eye_status === "el-icon-lock") {
        this.eye_status = "el-icon-unlock";
        this.inputtype = "text";
      } else {
        this.eye_status = "el-icon-lock";
        this.inputtype = "password";
      }
    },
    handleLogin() {
      if (this.gettersLoading) return;
      if (!this.userform.username || !this.userform.password) {
        this.isError = true;
        this.$toast('请完整输入账号和密码！');
        return;
      }
      this.login();
    },
    async initRoles() {
      const { data } = await getByTitle("roleList");
      this.$store.commit("initRoleList", data);
      localStorage.setItem("roleList", JSON.stringify(data));
    },
  },
};
</script>

<style scoped lang="less">
@import url('../../assets/mobileStyles/login/style.less');
</style>

<template>

  <div class="login-pc__container">
    <div class="login-pc__wrap">
      <div class="left-part">
        <div class="zhanwei"></div>
        <div class="text-container">
          <div class="big-title">AvengerS Gaming</div>
          <div class="text-info">
            第五人格ASG赛事后台管理系统，致力于结合数字化时代，多措并举，创办高效、高质量第五人格民间比赛。</div>
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
            <a href="https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0" target="_blank" class="icon-tab
                                "><img class="icon-image" src="../../assets/images/person.png" /></a>
            <a href="https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0" target="_blank" class="icon-tab
                                "><img class="icon-image" src="../../assets/images/logo_black.png" /></a>
            <a href="https://space.bilibili.com/436148512?spm_id_from=333.1007.0.0" target="_blank" class="icon-tab
                                "><img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0yMy45OTQgMjR2LS4wMDFoLjAwNnYtOC44MDJjMC00LjMwNi0uOTI3LTcuNjIzLTUuOTYxLTcuNjIzLTIuNDIgMC00LjA0NCAxLjMyOC00LjcwNyAyLjU4N2gtLjA3di0yLjE4NWgtNC43NzN2MTYuMDIzaDQuOTd2LTcuOTM0YzAtMi4wODkuMzk2LTQuMTA5IDIuOTgzLTQuMTA5IDIuNTQ5IDAgMi41ODcgMi4zODQgMi41ODcgNC4yNDN2Ny44MDF6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtLjM5NiA3Ljk3N2g0Ljk3NnYxNi4wMjNoLTQuOTc2eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTIuODgyIDBjLTEuNTkxIDAtMi44ODIgMS4yOTEtMi44ODIgMi44ODJzMS4yOTEgMi45MDkgMi44ODIgMi45MDkgMi44ODItMS4zMTggMi44ODItMi45MDljLS4wMDEtMS41OTEtMS4yOTItMi44ODItMi44ODItMi44ODJ6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PC9nPjwvc3ZnPg=="
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
            <input v-model="userform.password" @focus="isError = false" :class="isError ? 'error-input' : ''"
              class="input-side" type="password" placeholder="请输入密码" />
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

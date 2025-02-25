<template>
  <div>
    <header class="clearfix">
      <el-image class="pc-avatar" :src="require('@/assets/images/logo.png')"></el-image>
      <span class="title">ASG赛事后台管理系统</span>
    </header>
    <main>
      <div class="center-content" v-if="!isMobile">
        <el-image class="img-wrap" :src="require('@/assets/images/manager.svg')">
        </el-image>
      </div>
      <div class="center-content">
        <div class="loginwrap">
          <div class="header-form">
            <p class="header-title">系统登录</p>
          </div>
          <div class="info">
            <el-form ref="ruleForm" :model="userform" :rules="rules" class="demo-ruleForm">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userform.username" placeholder="请输入用户名">
                    <i class="el-icon-user-solid" slot="suffix"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="userform.password" :type="inputtype" placeholder="请输入密码"
                  @keyup.enter.native="submit('ruleForm')">
                  <i @click="toggleEye" slot="suffix" :class="eye_status"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="login__btn--primary" :class="gettersLoading ? 'disabled' : ''" @click="submit('ruleForm')">
                  <p class="login__btn--text">登 录</p>
                  <div v-show="gettersLoading" class="loader"></div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </main>
    <CommonFooter></CommonFooter>
  </div>
</template>

<script>
import { loginUser } from "@/api/login/index";
import CommonFooter from "@/components/CommonFooter.vue";
import { getByTitle } from "@/api/config";
import { mapGetters } from "vuex";
import { isMobile } from '@/utils/index';
export default {
  name: "LoginComp",
  components: {
    CommonFooter,
  },
  computed: {
    ...mapGetters(['waitDoNumber', 'waitAuthNumber','gettersLoading'])
  },
  data() {
    return {
      userform: {
        username: "",
        password: "",
      },
      eye_status: "el-icon-lock",
      inputtype: "password",
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
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
    submit(formName) {
      if (this.gettersLoading) return;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login();
        } else {
          this.$message.warning("请完整输入账号和密码！");
        }
      });
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
@import url('../../assets/mobileStyles/login/index.less');
@title-font: 1.5rem;

// 头部
header {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 12px;

  .pc-avatar {
    margin-left: 40px;
    display: block;
    width: 50px;
    height: 50px
  }

  span {
    color: #0089f3;
    display: block;
    font-weight: 700;
    line-height: 70px;
    height: 70px;
    font-size: @title-font;
  }
}

// 中间部分
main {
  width: 100%;
  height: calc(100dvh - 140px);
  overflow: hidden;
  background: url('../../assets/images/background.png');
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  .center-content {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .img-wrap {
      width: 60%;
      height: 60%
    }

    .loginwrap {
      width: 380px;
      padding: 18px 0 60px;
      border: 1px solid #ddd;
      background-color: white;
      box-sizing: border-box;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
      opacity: 0;
      animation: forwards showOpacity 0.732s;

      .header-form {
        margin: 16px;
        text-align: center;

        .header-title {
          font-size: 1.4rem;
          font-weight: bold;
          color: #4090ef;
        }
      }

      .info {
        width: 73%;
        margin: 0 auto;
        padding: 2%;

        .el-form-item {
          margin: 0;
          padding: 0;
          margin-bottom: 20px;

          &:nth-child(2) {
            margin-bottom: 30px;
          }

          .el-form-item__label {
            line-height: 30px;
          }

          .el-input i{
              line-height: 40px;
              font-size: 1.2em;
          }
        }

        // 按钮


        .login__btn--primary {
          background: #66b1ff;
          border-color: #66b1ff;
          color: #fff;
          white-space: nowrap;
          cursor: pointer;
          box-sizing: border-box;
          outline: 0;
          transition: 0.1s;
          border-radius: 4px;
          margin-top: 1em;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 2.6em;

          .login__btn--text {
            font-size: 1.1em;
            font-weight: 500;
          }

          &.disabled {
            background: #7eb8f7;
            border-color: #7bb3f0;
          }

          &:hover {
            background: #7eb8f7;
            border-color: #7bb3f0;
          }
        }
      }
    }
  }

  /* HTML: <div class="loader"></div> */
  .loader {
    width: 18px;
    --b: 4px;
    aspect-ratio: 1;
    border-radius: 50%;
    padding: 1px;
    background: conic-gradient(#0000 10%, #c5dbeb) content-box;
    -webkit-mask: repeating-conic-gradient(#0000 0deg,
        #000 1deg 20deg,
        #0000 21deg 36deg),
      radial-gradient(farthest-side,
        #0000 calc(100% - var(--b) - 1px),
        #000 calc(100% - var(--b)));
    -webkit-mask-composite: destination-in;
    mask-composite: intersect;
    animation: l4 1s infinite steps(10);
  }

  @keyframes l4 {
    to {
      transform: rotate(1turn);
    }
  }

  @keyframes showOpacity {
    0% {
      opacity: 0;
      transform: translateY(-80px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>

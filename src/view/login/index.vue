<template>
  <div>
    <header class="clearfix">
      <el-image style="margin-left: 40px; display: block; width: 50px; height: 50px"
        :src="require('@/assets/logo.png')"></el-image>
      <span class="title">ASG赛事后台管理系统</span>
    </header>
    <main>
      <el-image class="img-wrap" :src="require('@/assets/manager.svg')">
      </el-image>
      <div class="loginwrap">
        <div class="header-form">
          <p>系统登录</p>
        </div>
        <div class="info">
          <el-form ref="ruleForm" :model="userform" :rules="rules" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input suffix-icon="el-icon-user-solid" v-model="userform.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="userform.password" :type="inputtype" placeholder="请输入密码"
                @keyup.enter.native="submit('ruleForm')">
                <i @click="toggleEye" slot="suffix" :class="eye_status"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <div class="login__btn--primary" :class="loading ? 'disabled' : ''" @click="submit('ruleForm')">
                <p class="login__btn--text">登录</p>
                <div v-show="loading" class="loader"></div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <CommonFooter></CommonFooter>
  </div>
</template>

<script>
import { loginUser } from "@/api/login/index";
import { getInfo } from "@/api/home";
import CommonFooter from "@/components/CommonFooter.vue";
import { getByTitle } from "@/api/config";
import { getPermission } from "@/utils/permission.js";
import { mapGetters } from "vuex";
import { findTasks, getTask } from "@/api/admin/index.js";
export default {
  name: "LoginComp",
  components: {
    CommonFooter,
  },
  computed: {
    ...mapGetters(['waitDoNumber', 'waitAuthNumber', 'userInfo'])
  },
  data() {
    return {
      userform: {
        username: "",
        password: "",
      },
      loading: false,
      eye_status: "el-icon-lock",
      inputtype: "password",
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      }
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;
        const { data, status, message } = await loginUser(this.userform);
        if (status !== 200) throw new Error(message);
        if (data.code && data.code === 404) throw new Error(data.message);
        this.$store.commit("setToken", data);
        await this.initRoles();
        await this.initGetInfo();
        this.$router.push("/guide");
        this.$message.success("登录成功！");
      } catch (error) {
        if (error.response?.data?.message) {
          return this.$message.error(error.response.data.message);
        } 
        return this.$message.error(error.message);
      } finally {
        this.loading = false;
      }
    },
    async initGetInfo() {
      const { data } = await getInfo();
      this.$store.commit("getUserInfo", data);
      sessionStorage.setItem("money", data.money);
      sessionStorage.setItem("baseImg", data.base64);
      sessionStorage.setItem("chinaname", data.chinaname);
      sessionStorage.setItem("officium", data.officium);
      sessionStorage.setItem("id", data.id);
      sessionStorage.setItem("isadmin", data.isadmin);
      sessionStorage.setItem("money", data.money);
      await this.getWaitDone();
      await getPermission();
    },
    async getWaitDone() {
      try {
        if (this.waitDoNumber === null) {
          const id = Number(this.userInfo.id);
          if (Number.isNaN(id)) throw new Error('id不合法');
          getTask(id)
            .then((res) => {
              const waitDoNumber = res.data.filter(item => item.status === '0').length;
              this.$store.commit("SET_WAITDO_NUMBER", waitDoNumber);
            })
            .catch((err) => {
              this.$message.error(err instanceof Error ? err.message : err);
            });
        }
        if (this.waitAuthNumber === null) {
          const requestBody = {
            chinaname: '',
            status: '1',
            page: 1,
            limit: 999
          }
          findTasks(requestBody).then(({ data, status }) => {
            let waitAuthNumber = 0;
            if (status !== 200 || data.code === 401) {
              waitAuthNumber = 0;
            } else {
              waitAuthNumber = data?.data?.total ?? 0;
            }
            this.$store.commit("SET_WAITAUTH_NUMBER", waitAuthNumber);
          })
        }
      } catch (error) {
        console.log(error.message);
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
      if (this.loading) return;
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
@title-font: 1.5rem;

// 头部
header {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 12px;

  img {
    margin-left: 40px;
    display: block;
    width: 50px;
    height: 50px;
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
  height: calc(100vh - 140px);
  position: relative;
  overflow: hidden;
  background-image: url(../../assets/background.png);
  background-size: cover;

  .img-wrap {
    position: absolute;
    left: 12vw;
    top: 8vh;
    width: 32vw;
    height: 32vw;
  }

  .loginwrap {
    width: 380px;
    padding: 18px 0 60px;
    border: 1px solid #ddd;
    background-color: white;
    position: absolute;
    right: -435px;
    top: calc((100vh - 140px - 50vh - 40px) / 2);
    border-radius: 8px;
    animation: forwards move 0.8s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

    p {
      text-align: center;
      font-size: 22px;
      margin: 10px 0;

      i {
        color: #ebb563;
      }
    }

    .info {
      width: 70%;
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

        .el-input {
          i {
            line-height: 40px;
            font-size: 22px;
          }
        }
      }
    }
  }

  @keyframes move {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-600px);
    }
  }
}

// 底部
footer {
  height: 70px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    font-size: 13px;
    color: #303030;
  }
}

.header-form {
  margin: 16px;
  text-align: center;

  p {
    font-size: 1.2rem;
    font-weight: bold;
    color: #4090ef;
  }
}

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
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;

  .login__btn--text {
    font-size: 14px;
    font-weight: 500;
    margin-right: 12px;
  }

  &.disabled {
    background: #7eb8f7;
    border-color: #7bb3f0;
    cursor: not-allowed;
  }

  &:hover {
    background: #7eb8f7;
    border-color: #7bb3f0;
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
}
</style>

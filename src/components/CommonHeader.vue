<template>
  <div class="header-container">
    <div class="l-content">
      <span class="text"><router-link to="/index/information">ASG后台管理系统<span
            class="version">v0.9.2</span></router-link></span>
    </div>
    <div class="r-content">
      <div class="single__router" @click="routerToGw">前往ASG官网<i class="el-icon-d-arrow-right"></i></div>
      <div class="wait__do">
        <li @click="() => { $router.push({ path: '/index/information' }) }">
          <el-badge size="small" :max="99" :value="waitDoNumber" class="item">
            <span>任务待办</span>
          </el-badge>
        </li>
        <li @click="() => { $router.push({ path: '/index/task' }) }">
          <el-badge size="small" :max="99" :value="waitAuthNumber" class="item">
            <span>待审核</span>
          </el-badge>
        </li>
      </div>
      <div class="operation__container">
        <li @click="handleCommand('1')">
          <i class="el-icon-s-home"></i>
        </li>
        <li @click="handleCommand('4')">
          <i class="el-icon-s-tools"></i>
        </li>
        <li @click="handleCommand('2')">
          <i class="el-icon-crop"></i>
        </li>
        <li @click="handleCommand('3')">
          <i class="el-icon-switch-button"></i>
        </li>
      </div>
      <!-- <el-dropdown type="primary" @command="handleCommand">
        <span class="el-dropdown-link">
          <img class="user" :src="imgUrl">
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-s-home" command="1">我的工作台</el-dropdown-item>
          <el-dropdown-item icon="el-icon-crop" command="2">自定义工作台</el-dropdown-item>
          <el-dropdown-item command="3">
            <span style="color:#f40"><i class="el-icon-switch-button"></i>退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" :append-to-body="true" :close-on-click-modal="false"
      width="500px" @close="closeD('form')" @open="openD">
      <div class="form-body">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item label="请输入邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="请输入新密码" prop="password">
            <div style="display: flex; gap: 20px; align-items: center">
              <el-input type="password" v-model="form.password" show-password></el-input>
              <el-button @click.prevent="getToken('form')" :disabled="showToken"
                v-loading="changeLoading">获取验证</el-button>
            </div>
          </el-form-item>
          <transition name="run">
            <el-form-item label="请输入邮箱验证码" v-show="showToken">
              <div style="display: flex; gap: 20px; align-items: center">
                <el-input v-model="form.token"></el-input>
                <el-button @click="confirm" type="success">确认更换</el-button>
              </div>
            </el-form-item>
          </transition>
        </el-form>
      </div>
    </el-dialog>
    <el-drawer title="个人信息" :visible.sync="infoDrawerVisible" direction="rtl" @close="infoDrawerVisible = false">
      <div class="info-body">
        <header>
          <div class="image__container">
            <el-image :src="avatar" style="width:100%;height:100%">
              <div slot="error">
                <img style="width:99px;height:98px;border:1px dashed #4090EF" src="@/assets/logo.png">
              </div>
            </el-image>
            <div class="mask__content">
              <p @click="uploadAvatar">更新头像</p>
            </div>
          </div>
          <div class="info-columns">
            <h4>{{ chinaname }}</h4>
            <p @click="routerToGw">前往ASG官网</p>
          </div>
        </header>
        <input id="avatar" type="file" style="display: none;" @input="beforeInputAvatar" />
        <el-collapse>
          <el-collapse-item title="中文名称-编辑" name="1">
            <div class="fix_name_body" v-show="isEdit">
              <el-input v-model="newChiname" ref="nameipt" size="small" placeholder="请输入中文名" clearable></el-input>
              <i class="el-icon-folder-checked saveIcon" @click="changeName"></i>
              <i class="el-icon-close closeIcon" @click="isEdit = false"></i>
            </div>
            <div class="fix_name_body" v-show="!isEdit">
              <el-input v-model="chinaname" disabled size="small"></el-input>
              <i v-show="!isEdit" class="el-icon-edit" @click="handleChangeName"></i>
            </div>
          </el-collapse-item>
          <el-collapse-item title="qq号-编辑" name="2">
            <div class="fix_name_body">
              <el-input v-model="userInfo.qqnumber" size="small" placeholder="请输入QQ号" clearable></el-input>
              <i class="el-icon-folder-checked saveIcon" @click="changeQQ"></i>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { confirmUpdate } from "@/api/login/index.js";
import { findTasks, getTask } from "@/api/admin/index.js";
import { getToken } from "@/utils/auth";
import { updateChinaName } from "@/api/home/index.js";
import { uploadImg } from "@/api/home/index.js";
import { mapGetters } from "vuex";
import { updateQQ } from '@/api/login';
export default {
  name: "CommonHeader",
  data() {
    return {
      userType: '管理',
      dialogVisible: false,
      form: {
        email: "",
        password: "",
        token: "",
      },
      showToken: false,
      changeLoading: false,
      rules: {
        email: [
          { required: true, message: '请填写邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写新密码', trigger: 'blur' }
        ]
      },
      waitDoNumber: 0,
      waitAuthNumber: 0,
      infoDrawerVisible: false,
      newChiname: '',
      isEdit: false,
    };
  },
  computed: {
    ...mapGetters(['adminRoles', 'userInfo']),
    isSuperAdmin() {
      return this.adminRoles === '2' || sessionStorage.getItem('adminRoles') === '2';
    },
    avatar() {
      return this.userInfo.base64 || sessionStorage.getItem('baseImg');
    },
    chinaname() {
      return this.userInfo.chinaname || sessionStorage.getItem('chinaname');
    }
  },
  created() {
    this.initBaseNumber();
  },
  methods: {
    uploadAvatar() {
      const ipt = document.getElementById('avatar');
      ipt.click();
    },
    beforeInputAvatar(e) {
      try {
        const fileTypes = ["JPEG", "JPEG", "PNG"];//文件后缀只能是这五类
        const maxSize = 1024;
        const file = e.target.files[0];
        const fileType = file.type.split('/').at(-1).toUpperCase();
        const fileSize = file.size / 1024;
        if (!fileTypes.includes(fileType)) throw new Error('头像只允许是JPG、JPEG、或者是PNG类型');
        if (fileSize > maxSize) throw new Error('图片不能超过1MB');
        const reader = new FileReader();
        reader.readAsDataURL(file);
        const vue = this;
        reader.onload = async function (event) {
          const fileBase = event.target.result;
          const { status } = await uploadImg(fileBase);
          if (status !== 200) throw new Error('服务端异常，请联系网站管理员');
          vue.$message.success('上传成功');
          vue.$store.commit('SET_LOGO', fileBase);
        }
      } catch (error) {
        this.$message.error(error.message);
      }
    },
    async changeQQ(){
         try {
          const qq = this.userInfo.qqnumber;
          const {  status } = await updateQQ(qq);
          if(status !== 200) throw new Error('操作失败，后端异常');
          this.$message.success('修改成功');
         } catch (error) {
          this.$message.error(error.message);
         }
    },
    handleChangeName() {
      this.newChiname = this.chinaname;
      this.isEdit = true;
      console.log(this.$refs.nameipt, 'this.$refs.nameipt');
      this.$nextTick(() => {
        this.$refs.nameipt.focus();
      })

    },
    async changeName() {
      if (!this.newChiname) {
        return this.$message.error('请输入中文名');
      }
      try {
        await updateChinaName(this.newChiname);
        this.$store.commit('UPDATE_NAME', this.newChiname);
        this.$message.success('修改成功！');
      } catch (error) {
        this.$message.error('服务端异常，请联系网站管理');
      } finally {
        this.isEdit = false;
      }
    },
    routerToGw() {
      window.location.href = `https://idvasg.cn/#/?${encodeURIComponent(getToken())}`;
    },
    initBaseNumber() {
      const waitDoNumber = sessionStorage.getItem('waitDoNumber');
      const waitAuthNumber = sessionStorage.getItem('waitAuthNumber');
      if (!waitDoNumber) {
        const id = Number(window.sessionStorage.getItem('id'))
        if (Number.isNaN(id)) throw new Error('id不合法');
        getTask(id)
          .then((res) => {
            this.waitDoNumber = res.data.filter(item => item.status === '0').length;
            sessionStorage.setItem('waitDoNumber', this.waitDoNumber)
          })
          .catch((err) => {
            this.$message.error(err instanceof Error ? err.message : err);
          });
      } else {
        this.waitDoNumber = waitDoNumber;
      }
      if (!waitAuthNumber) {
        const requestBody = {
          chinaname: '',
          status: '1',
          page: 1,
          limit: 999
        }
        findTasks(requestBody).then(({ data, status }) => {
          if (status !== 200 || data.code === 401) {
            this.waitAuthNumber = 0;
          } else {
            this.waitAuthNumber = data.total;
          }
          sessionStorage.setItem('waitAuthNumber', this.waitAuthNumber)
        })
      } else {
        this.waitAuthNumber = waitAuthNumber;
      }
    },
    handleCommand(command) {
      if (command === '1') {
        this.goManager();
      } else if (command === '2') {
        this.toCustom();
      } else if (command === '3') {
        this.logout();
      } else if (command === '4') {
        this.infoDrawerVisible = true;
      }
    },
    goManager() {
      this.$router.push({ path: '/index/information' });
    },
    toCustom() {
      this.$router.push({ path: '/myCustomWorker' });
    },
    async logout() {
      try {
        const flag = await this.$confirm('您确定退出登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        if (flag === 'confirm') {
          this.$store.commit("removeToken");
          sessionStorage.removeItem('baseImg');
          sessionStorage.removeItem('waitDoNumber');
          sessionStorage.removeItem('waitAuthNumber');
          this.$router.push("/");
          this.$message.warning("您已退出登录！");
        }
      } catch (error) {
        if (typeof error === 'string' && error === 'cancel') return;

      }
    },
    handleMenu() {
      this.$store.commit("collapseMenu");
    },
    handleUpdate() {
      this.dialogVisible = true;
    },
    // getToken(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.changeLoading = true
    //       updatePassword(this.form.email)
    //         .then(() => {
    //           this.$message.success("发送成功,请输入验证码");
    //           this.showToken = true;
    //           this.changeLoading = false
    //         })
    //         .catch(err => {
    //           this.$message.error(err.message)
    //           this.changeLoading = false
    //         })
    //     } else {
    //       this.$message.error("请完整填写表单内容！");
    //     }
    //   });
    // },
    confirm() {
      if (this.form.token) {
        confirmUpdate(this.form.email, this.form.password, this.form.token)
          .then(() => {
            this.$message.success("修改成功,请重新登录！");
            this.$store.commit("removeToken");
            this.$router.push("/");
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
      } else {
        this.$message.error("请输入验证码！")
      }

    },
    closeD(formName) {
      this.dialogVisible = false
      this.showToken = false
      this.form.token = ''
      this.$refs[formName].resetFields();
    },
    openD() {
      this.form.email = sessionStorage.getItem("email") || ''
    }
  },
};
</script>

<style scoped lang="less">
@activeColor: #f7e757;

.header-container {
  padding: 0 20px;
  background-color: #0D47A1;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .text {
    a {
      color: #fff;
      font-size: 18px;
      margin-left: 10px;
      font-weight: 500;

      .version {
        font-size: 12px;
        color: #d1d1d1;
        margin-left: 6px;
      }
    }
  }

  .r-content {
    display: flex;
    align-items: center;

    .wait__do {
      padding: 0 16px;
      border-left: 1px solid #bec4cf;
      display: flex;
      align-items: center;
      height: 34px;
      margin-left: 32px;

      li {
        font-size: 14px;
        margin: 0 14px;
        font-weight: 400;
        color: #fff;
        cursor: pointer;

        &:hover {
          color: @activeColor;
        }
      }
    }

    .operation__container {
      display: flex;
      height: 34px;
      align-items: center;
      padding-left: 18px;
      border-left: 1px solid #bec4cf;

      li {
        width: 34px;
        height: 34px;
        border: 1px solid #bec4cf;
        border-radius: 50%;
        margin: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-sizing: border-box;

        i {
          font-size: 16px;
          color: #fff;
        }

        &:hover {
          border: 1px solid @activeColor;

          & i {
            color: @activeColor;
          }

        }
      }
    }

  }
}

span {
  width: 100%;
}

.form-body {
  padding: 0px 50px 20px;
}

.run-enter-active {
  animation: bounce-in .4s;
}

/* 离开的时候要激活的样式 */
.run-leave-active {
  animation: bounce-in .4s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}

.single__router {
  width: fit-content;
  height: 22px;
  padding: 5px 16px;
  background: #262E3B;
  color: #B9BDC4;
  font-size: 14px;
  display: flex;
  align-items: center;
  font-weight: 600;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    color: @activeColor;
  }
}

.info-body {
  padding: 12px;

  header {
    display: flex;
    align-items: flex-start;

    .info-columns {
      margin-left: 18px;
      display: flex;
      flex-direction: column;
      gap: 24px 0;

      h4 {
        font-size: 24px;
        font-weight: bold;

        i {
          margin-left: 6px;
          color: #4090EF;
          cursor: pointer;

          &:hover {
            color: #c4d5ef
          }
        }
      }

      p {
        color: #4090EF;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
          text-underline-offset: 0.2em;
        }
      }
    }
  }

  .fix_name_body {
    font-size: 22px;
    display: grid;
    grid-template-columns: auto 30px 30px;
    gap: 0 12px;
    align-items: center;
    margin: 24px 0;

    i {
      font-weight: bold;
      cursor: pointer;

      &.saveIcon {
        color: #4090EF;

        &:hover {
          color: #6c8fc5
        }
      }

      ;

      &.closeIcon {
        color: #f40;

        &:hover {
          color: rgb(231, 143, 143)
        }
      }
    }
  }

  .image__container {
    width: 100px;
    height: 100px;
    position: relative;

    .mask__content {
      position: absolute;
      inset: 0;
      align-items: center;
      justify-content: center;
      display: none;
      background: rgba(0, 0, 0, 0.63);
      cursor: pointer;

      p {
        color: #4090EF;
      }
    }

    &:hover {
      .mask__content {
        display: flex;
      }
    }
  }
}
</style>

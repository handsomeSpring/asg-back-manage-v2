<template>
  <div class="header-container">
    <div class="l-content">
      <span class="text"><router-link to="/guide">ASG后台管理系统<span class="version">{{ version
            }}</span></router-link></span>
    </div>
    <div class="r-content">
      <el-autocomplete class="inline-input" size="small" v-model="searchInfo" :fetch-suggestions="querySearch"
        placeholder="请输入关键字检索" @select="handleSelectMenu">
        <i class="el-icon-search el-input__icon" slot="suffix">
        </i>
      </el-autocomplete>
      <div class="wait__do">
        <li @click="() => { $router.push({ path: '/guide' }) }">
          <el-badge size="small" :max="99" :value="waitDoNumber" class="item">
            <span>任务待办</span>
          </el-badge>
        </li>
        <li @click="() => { $router.push({ path: '/authorization/task' }) }">
          <el-badge size="small" :max="99" :value="waitAuthNumber" class="item">
            <span>待审核</span>
          </el-badge>
        </li>
      </div>
      <div class="operation__container">
        <el-tooltip class="item" effect="dark" content="回到首页" placement="bottom">
          <li @click="handleCommand('1')">
            <i class="el-icon-s-home"></i>
          </li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="个人中心" placement="bottom">
          <li @click="handleCommand('4')">
            <i class="el-icon-s-tools"></i>
          </li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="切换主题" placement="bottom">
          <li @click="handleCommand('5', $event)">
            <i class="el-icon-bangzhu"></i>
          </li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="自定义工作台" placement="bottom">
          <li @click="handleCommand('2')">
            <i class="el-icon-crop"></i>
          </li>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
          <li @click="handleCommand('3')">
            <i class="el-icon-switch-button"></i>
          </li>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { confirmUpdate } from "@/api/login/index.js";
import { getToken } from "@/utils/auth";
import { getByTitle } from "@/api/config";
import { mapGetters } from "vuex";
export default {
  name: "CommonHeader",
  data() {
    return {
      version: '',
      showSearch: false,
      searchInfo: '',
      searchList: [
        {
          value: '前往ASG官网',
          type: 'function',
          prop: 'routerToGw'
        }
      ],
    };
  },
  computed: {
    ...mapGetters(['waitDoNumber', 'waitAuthNumber', 'menuOptions'])
  },
  watch: {
    $route: {
      handler() {
        this.searchInfo = '';
      },
    },
  },
  created() {
    if (this.menuOptions && Array.isArray(this.menuOptions)) {
      this.menuOptions.forEach(item => {
        if (item.component !== 'router-view') {
          this.searchList.push({
            value: item.title,
            type: 'router',
            path: item.path
          })
        };
        if (item.children && item.children.length > 0) {
          item.children.forEach(child => {
            this.searchList.push({
              value: child.title,
              type: 'router',
              path: child.path
            })
          })
        }
      })
    }
    getByTitle('versionConfig').then(res => {
      if(res.data && Array.isArray(res.data)){
        this.version = res.data.find(item => item.system === 'admin')?.version ?? '无版本号';
      }
    })
  },
  methods: {
    handleSelectMenu(item) {
      if (item.type === 'function') {
        this[item.prop]();
      } else if (item.type === 'router') {
        console.log(item.path, 'item.path===')
        this.$router.push(item.path)
      }
    },
    querySearch(queryString, cb) {
      var searchList = this.searchList;
      var results = queryString ? searchList.filter(this.createFilter(queryString)) : searchList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (searchList) => {
        return (searchList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    routerToGw() {
      window.location.href = `https://idvasg.cn/#/?${encodeURIComponent(getToken())}`;
    },
    handleCommand(command, $event) {
      if (command === '1') {
        this.goManager();
      } else if (command === '2') {
        this.toCustom();
      } else if (command === '3') {
        this.logout();
      } else if (command === '4') {
        this.$router.push({ path: '/userInfo' })
      } else if (command === '5') {
        this.changeColor($event)
      }
    },
    changeColor(e) {
      const transition = document.startViewTransition(() => {
        document.documentElement.classList.toggle('dark');
      });
      const x = e.clientX;
      const y = e.clientY;
      const tragetRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0% at ${x}px ${y}px)`, `circle(${tragetRadius}px at ${x}px ${y}px)`],
          },
          {
            duration: 450,
            pseudoElement: '::view-transition-new(root)'
          }
        )
      })
    },
    goManager() {
      this.$router.push({ path: '/guide' });
    },
    toCustom() {
      this.$router.push({ path: '/myCustomWorker' });
    },
    focusSeachInp() {
      this.showSearch = true;
    },
    blurSearchInp() {
      this.showSearch = false;
      this.searchInfo = '';
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
          this.$store.commit("SET_WAITDO_NUMBER", null);
          this.$store.commit("SET_WAITAUTH_NUMBER", null);
          this.$router.push("/login");
          this.$message.warning("您已退出登录！");
        }
      } catch (error) {
        if (typeof error === 'string' && error === 'cancel') return;
      }
    },
    handleMenu() {
      this.$store.commit("collapseMenu");
    },
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
  },
};
</script>

<style scoped lang="less">
@activeColor: #f7e757;

.header-container {
  padding: 0 20px;
  // background-color: #0D47A1;
  background-color: var(--background-color);
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
    height: 22px;
    padding: 5px 22px;
    width: calc(100% - 32px);
    background: #262E3B;
    font-size: 14px;
    border-radius: 3px;
    outline: none;
    border: none;
    color: #4090EF;
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


}
</style>
